# -*- coding:utf-8 -*-
import hashlib
import datetime
import jwt
from flask_restful import Resource, Api, reqparse, abort
import json
import os
import sys
from flask import Flask, render_template, jsonify, request, session, redirect, url_for, make_response
from pymongo import MongoClient
clients = MongoClient('mongodb://agapao1:1998@52.78.67.43', 27017)
Mongodb = clients.aunae
Mongodb1 = clients.solution

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('swmaker-84884-firebase-adminsdk-mhhgb-e61c6d6d0e.json')
firebase_admin.initialize_app(cred)
Firedb = firestore.client()


app = Flask(__name__)

SECRET_KEY = 'apple'



##  HTML

@app.route('/')
def home():
    return render_template('main.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/logout')
def logout():
    return render_template('logout.html')


@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/main')
def main():
    return render_template('main.html')


@app.route('/mypage')
def mypage():
    return render_template('mypage.html')


@app.route('/reservation')
def reservation():
    return render_template('reservation.html')


@app.route('/result')
def result():
    want_name = request.args.get('name')
    return render_template('report.html', name=want_name)


@app.route('/solution')
def solution():
    return render_template('solution.html')


@app.route('/popup')
def popup():
    want_name = request.args.get('name')
    return render_template('popup.html', name=want_name)


@app.route('/cusadd')
def cusadd():
    return render_template('cusadd.html')

@app.route('/inspection')
def inspection():
    return render_template('inspection.html')



##  로그인을 위한 API 

@app.route('/api/register', methods=['POST'])
def api_register():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    Mongodb.user.insert_one(
        {'id': id_receive, 'pw': pw_hash, 'nick': nickname_receive})

    return jsonify({'result': 'success'})

# [로그인 API]


@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    result = Mongodb.user.find_one({'id': id_receive, 'pw': pw_hash})

    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=1800)
        }
        token = jwt.encode(payload, SECRET_KEY,
                           algorithm='HS256')
        return jsonify({'result': 'success', 'token': token})

    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

# [유저 정보 확인 API]


@app.route('/api/nick', methods=['GET'])
def api_valid():
    token_receive = request.headers['token_give']

    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        print(payload)
        userinfo = Mongodb.user.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})


@app.route('/show', methods=['GET'])
def show():
    name = request.args.get('name')
    orders = list(Mongodb.solution.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'all_orders': orders})

@app.route('/getsol', methods=['GET'])
def getsol():
    num = request.args.get('num')
    want = Mongodb1.solution.find({'component':num}, {'_id': 0})
    orders = list(want)
    return jsonify({'result': 'success', 'all_orders': orders})

@app.route('/showsolution', methods=['GET'])
def showsolution():
    name = request.args.get('name')
    want_item = Mongodb.solution.find_one({'name': name}, {'_id': 0})
    order = list(want_item['solution'])
    return jsonify({'result': 'success', 'all_orders': order})


@app.route('/showscore', methods=['GET'])
def showscore():
    name = request.args.get('name')
    want_item = Mongodb.solution.find_one({'name': name}, {'_id': 0})
    score1 = list(want_item['score1'])
    score2 = list(want_item['score2'])
    score3 = list(want_item['score3'])
    score4 = list(want_item['score4'])
    score5 = list(want_item['score5'])
    return jsonify({'result': 'success', 'score1': score1, 'score2': score2, 'score3': score3, 'score4': score4, 'score5': score5})


@app.route('/savedb', methods=['POST'])
def savedb():
    data = request.get_json()
    name_receive = data['name_give']
    sol_receive = data['arr']
    Mongodb.solution.update_one({'name': name_receive}, {
                           '$set': {'solution': sol_receive}})
    return jsonify({'result': 'success'})


@app.route('/give', methods=['POST'])
def give():
    data = request.get_json()
    arr_receive = data['soll']
    doc_ref = Firedb.collection(u'solution_list').document(u'user01')
    doc_ref.set({
        u'{i}' : {
            u'check' : False,
            u'solution' : arr_receive,
            u'title' : ""
        }
    })
    return jsonify({'result': 'success'})


@app.route('/savescore', methods=['POST'])
def savescore():
    data = request.get_json()
    name_receive = data['name_give']
    score1 = data['number1']
    score2 = data['number2']
    score3 = data['number3']
    score4 = data['number4']
    score5 = data['number5']
    Mongodb.solution.update({'name': name_receive}, {
        '$push': {'score1': score1}})
    Mongodb.solution.update({'name': name_receive}, {
        '$push': {'score2': score2}})
    Mongodb.solution.update({'name': name_receive}, {
        '$push': {'score3': score3}})
    Mongodb.solution.update({'name': name_receive}, {
        '$push': {'score4': score4}})
    Mongodb.solution.update({'name': name_receive}, {
        '$push': {'score5': score5}})
    return jsonify({'result': 'success'})



@app.route('/addcustomer', methods=['POST'])
def addcustomer():
    name_receive = request.form['name_give']
    age_receive = request.form['age_give']
    phone_receive = request.form['phone_give']
    id_receive = request.form['id_give']
    password_receive = request.form['password_give']
    image_receive = request.form['image_give']

    doc = {
        'name': name_receive,
        'age': age_receive,
        'phone': phone_receive,
        'id': id_receive,
        'password': password_receive,
        'image': image_receive
    }

    Mongodb.solution.insert_one(doc)

    return jsonify({'result': 'success', 'msg': '저장이 완료되었습니다'})


if __name__ == '__main__':
    app.run('localhost', port=5000, debug=True)