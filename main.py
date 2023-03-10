from flask import Flask, render_template, request
from pm25 import get_pm25, get_six_pm25, get_countys, get_county_pm25
import json


app = Flask(__name__)


# 首頁
sort = False


@app.route('/')
@app.route('/<name>')
def index(name='GUEST'):
    date = get_date()
    return render_template('./index.html', x_name=name, date=date)


@app.route('/date')
def get_date():
    from datetime import datetime
    date = datetime.now()

    return date.strftime('%Y-%m-%d %H:%M:%S')


@app.route('/book/<int:id>')
def get_book(id):
    try:
        books = {1: "python", 2: "html", 3: "css"}

        return books[id]
    except Exception as e:
        print(e)
        return '書籍編號錯誤'


@app.route('/sum/x=<a>&y=<b>')
def get_sum(a, b):
    total = eval(a)+eval(b)
    return f'{a}+{b}={total}'


@app.route('/bmi/name=<name>&height=<height>q&weight=<weight>')
def get_bmi(name, height, weight):
    try:
        bmi = eval(yweight)/(eval(height)/100)**2

        return 'BMI:%.2f' % bmi
    except:
        return '參數輸入錯誤!'


@app.route('/stock')
def get_stock():
    stocks = [
        {'分類': '日經指數', '指數': '22.920.30'},
        {'分類': '日經指數', '指數': '22.920.30'},
        {'分類': '日經指數', '指數': '22.920.30'},
        {'分類': '日經指數', '指數': '22.920.30'},
    ]

    return render_template('./stock.html', date=get_date(), stocks=stocks)


@app.route('/pm25', methods=['GET', 'POST'])
def pm25():
    global sort
    if request.method == 'POST':
        sort = not sort

    date = get_date()
    columns, values = get_pm25(sort)

    print(columns, values)

    return render_template('./pm25.html', **locals())


@app.route('/pm25_charts')
def pm25_charts():

    return render_template('./pm25_charts.html', countys=get_countys())


@app.route('/pm25_json', methods=['POST'])
def pm25_json():
    columns, values = get_pm25()
    site = [value[1] for value in values]
    pm25 = [value[2] for value in values]
    date = values[0][-1]

    return json.dumps({'date': date, 'site': site, 'pm25': pm25}, ensure_ascii=False)

    '''print(site, pm25)'''


@app.route('/pm25-six-jason', methods=['POST'])
def pm25_six_json():
    values = get_six_pm25()
    site = [value[0] for value in values]
    pm25 = [value[1] for value in values]

    return json.dumps({'site': site, 'pm25': pm25}, ensure_ascii=False)


@app.route('/pm25-county/<county>', methods=['POST'])
def pm25_county_json(county):
    try:
        values = get_county_pm25(county)
        site = [value[0] for value in values]
        pm25 = [value[1] for value in values]

        return json.dumps({'site': site, 'pm25': pm25}, ensure_ascii=False)

    except:
        return '取得資料失敗'


if __name__ == '__main__':
    app.run(debug=True)
