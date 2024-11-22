try:
    from flask import *
    import yfinance as yf
    import config
except:
    import sys, os
    os.system('pip install libs.txt')
    print('Please re-run this code')
    sys.exit(1)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/get_data/<symbol>')
def get_data(symbol):
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
        return jsonify({"error": str(e)}), 500

@app.route('/get_price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
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
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_list', methods=['GET'])
def get_list():
    try:
        #tymczasowa lista. później będzie baza danych
        list = ["AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL", "INTC", "AMD", "NFLX"]
        results = {}

        for i in list:
            stocks = yf.Ticker(i)
            price = stocks.history(period="1d")["Close"].iloc[-1]
            results[i] = price
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 418

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.port, debug=True)