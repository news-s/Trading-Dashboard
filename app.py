try:
    from flask import *
    import yfinance as yf
    import config, random, bcrypt
    from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
    from sqlalchemy.orm import declarative_base, relationship, sessionmaker, joinedload
except:
    import sys, os
    os.system('pip install libs.txt')
    print('Please re-run this code')
    sys.exit(1)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///instance/database.sqlite3'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
salt = bcrypt.gensalt()

key = ""
for i in range(255):
    key = key + str(random.randint(0, 9))
app.secret_key = key
del key

#Dekorator do walidacji czy użytkownik jest zalogowany
def isLoggedIn(func):
    def wrapper(*args, **kwargs):
        if 'name' in session:
            return func(*args, **kwargs)
        else:
            return redirect(url_for('login'))
    return wrapper

############################################################################  Models

Base = declarative_base()

class Users(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    password = Column(String(255))

    notes = relationship('Notes', back_populates='user')  # Corrected 'Notes' to 'notes'
    favstocks = relationship('FavStocks', back_populates='user')  # Corrected 'FavStocks' to 'favstocks'


class Notes(Base):
    __tablename__ = 'Notes'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('Users.id'))
    title = Column(String(255))
    text = Column(String(1000))

    user = relationship('Users', back_populates='notes')  # Corrected to match 'notes' in Users


class FavStocks(Base):
    __tablename__ = 'FavStocks'

    id = Column(Integer, primary_key=True)
    favStock = Column(String(8), nullable=False)
    user_id = Column(Integer, ForeignKey('Users.id'))

    user = relationship('Users', back_populates='favstocks')  # Corrected to match 'favstocks' in Users

engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], echo=True)
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
dbsession = Session()

############################################################################ Routes

@app.route('/')
def index():
    if 'name' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@isLoggedIn
@app.route('/dashboard')
def dashboard():
    if 'name' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/get_data/<symbol>')
def get_data(symbol):
    if 'name' not in session:
        return redirect(url_for('login'))
    try:
        spolka = yf.Ticker(symbol)
        dane = spolka.history(period="1mo", interval="1d")
        wynik = {
                "symbol": symbol,
                "data": [
                    {
                        "date": str(index.date()),
                        "open": row["Open"],
                        "high": row["High"],
                        "low": row["Low"],
                        "close": row["Close"]
                    }
                    for index, row in dane.iterrows()
                ]
            }
        return jsonify(wynik), 200
    except Exception as e:
        return 500

@app.route('/get_price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    if 'name' not in session:
        return redirect(url_for('login'))
    try:
        # Pobierz dane o spółce
        spolka = yf.Ticker(symbol)
        aktualna_cena = spolka.history(period="1d")["Close"].iloc[-1]  # Ostatnia cena zamknięcia

        # Przygotowanie odpowiedzi
        wynik = {
            "symbol": symbol,
            "current_price": aktualna_cena
        }
        return jsonify(wynik), 200
    except Exception as e:
        return 500
    
@app.route('/get_list', methods=['GET'])
def get_list():
    if 'name' not in session:
        return redirect(url_for('login'))
    try:
        # Tymczasowo do testów
        users = dbsession.query(Users).options(joinedload(Users.favstocks)).filter_by(name=session['name']).all()
        results = {}

        if not users:  # Jeśli lista użytkowników jest pusta
            default_stocks = ["AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL", "INTC", "AMD", "NFLX"]
            for stock in default_stocks:
                stocks = yf.Ticker(stock)
                price = stocks.history(period="1d")["Close"].iloc[-1]
                results[stock] = price
            results['Info'] = 'Dodaj jakieś wybrane przez siebie obserwowane'
            return jsonify(results), 200

        for user in users:
            for fav_stock in user.favstocks:  # Iteracja po ulubionych akcjach użytkownika
                stock_symbol = fav_stock.favStock  # Upewnij się, że favstocks ma właściwość "symbol"
                stocks = yf.Ticker(stock_symbol)
                price = stocks.history(period="1d")["Close"].iloc[-1]
                results[stock_symbol] = price

        return jsonify(results), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "im on coffee break"}), 418

    
@app.route('/add_fav/<tag>', methods=['GET'])
def add_fav(tag):
    if 'name' not in session:
        return redirect(url_for('login'))
    try:
        print(session['name'])
        user = dbsession.query(Users).filter_by(name=session['name']).first()
        stock = FavStocks(favStock=tag, user_id=user.id)
        dbsession.add(stock)
        dbsession.commit()
        return jsonify({"message": "Dodano do ulubionych"}), 200
    except Exception as e:
        return 500
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = dbsession.query(Users).filter_by(name=request.form['username']).first()
        if user is None:    return redirect(url_for('signup'))
        if bcrypt.checkpw(request.form['password'].encode('utf-8'), user.password):
            session['name'] = request.form['username']
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        if dbsession.query(Users).filter_by(name=request.form['username']).first() == None:
            hashed_password = bcrypt.hashpw(request.form['password'].encode('utf-8'), salt)
            user = Users(name=request.form['username'], password=hashed_password)
            dbsession.add(user)
            dbsession.commit()
            session['name'] = request.form['username']
            return redirect(url_for('dashboard'))
        else:
            return redirect(url_for('signup'))
    return render_template('signup.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.port, debug=True)