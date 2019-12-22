import os
import secrets
from PIL import Image
from flask import render_template, url_for, flash, redirect, request, jsonify, session
from flaskapp import app, db, bcrypt, config
from flaskapp.models import User, Post
from flaskapp.forms import RegistrationForm, LoginForm, UpdateAccountForm
from flask_login import login_user, current_user, logout_user, login_required
import stripe
import paypalrestsdk
import urllib.request
from pusher import Pusher
from datetime import datetime
import httpagentparser
import json
import hashlib
from flaskapp.dbsetup import create_connection, create_session, update_or_create_page, select_all_sessions, select_all_user_visits, select_all_pages

# configure pusher object
pusher = Pusher(
app_id= config.PUSHER_APP_ID,
key=config.PUSHER_APP_KEY,
secret= config.PUSHER_APP_SECRET,
cluster= config.PUSHER_APP_CLUSTER,
ssl=True)

database = "./pythonsqlite.db"
conn = create_connection(database)
c = conn.cursor()

userOS = None
userIP = None
userCity = None
userBrowser = None
userCountry = None
userContinent = None
sessionID = None

def main():
    global conn, c
    
def parseVisitor(data):
    update_or_create_page(c,data)
    pusher.trigger(u'pageview', u'new', {
        u'page': data[0],
        u'session': sessionID,
        u'ip': userIP
    })
    pusher.trigger(u'numbers', u'update', {
        u'page': data[0],
        u'session': sessionID,
        u'ip': userIP
    })

@app.before_request
def getAnalyticsData():
    global userOS, userBrowser, userIP, userContinent, userCity, userCountry,sessionID 
    userInfo = httpagentparser.detect(request.headers.get('User-Agent'))
    userOS = userInfo['platform']['name']
    userBrowser = userInfo['browser']['name']
    userIP = "72.229.28.185" if request.remote_addr == '127.0.0.1' else request.remote_addr
    api = "https://www.iplocate.io/api/lookup/" + userIP
    try:
        resp = urllib.request.urlopen(api)
        result = resp.read()
        result = json.loads(result.decode("utf-8"))                                                                                                     
        userCountry = result["country"]
        userContinent = result["continent"]
        userCity = result["city"]
    except:
        print("Could not find: ", userIP)
    getSession()
    
def getSession():
    global sessionID
    time = datetime.now().replace(microsecond=0)
    if 'user' not in session:
        lines = (str(time)+userIP).encode('utf-8')
        session['user'] = hashlib.md5(lines).hexdigest()
        sessionID = session['user']
        pusher.trigger(u'session', u'new', {
            u'ip': userIP,
            u'continent': userContinent,
            u'country': userCountry,
            u'city': userCity,
            u'os': userOS,
            u'browser': userBrowser,
            u'session': sessionID,
            u'time': str(time),
        })
        data = [userIP, userContinent, userCountry, userCity, userOS, userBrowser, sessionID, time]
        create_session(c,data)
    else:
        sessionID = session['user']
        
@app.route('/')
@app.route('/home')
def home():
    data = ['home', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    return render_template('home.html')
    
@app.route('/about')
def about():
    data = ['about',sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    return render_template('about.html')
    
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')
    
@app.route('/dashboard/<session_id>', methods=['GET'])
def sessionPages(session_id):
    result = select_all_user_visits(c,session_id)
    return render_template("dashboard-single.html",data=result)
    
@app.route('/get-all-sessions')
def get_all_sessions():
    data = []
    dbRows = select_all_sessions(c)
    for row in dbRows:
        data.append({
            'ip' : row['ip'],
            'continent' : row['continent'],
            'country' : row['country'], 
            'city' : row['city'], 
            'os' : row['os'], 
            'browser' : row['browser'], 
            'session' : row['session'],
            'time' : row['created_at']
        })
    return jsonify(data)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    data = ['registration', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created. Please Login!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    data = ['login', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login unsuccessful, please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn

@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    data = ['account', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    if form.validate_on_submit():
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account', image_file=image_file, form=form)

stripe.api_key = config.STRIPE_SECRET_KEY
@app.route('/pricing')
def pricing():
    data = ['pricing', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    return render_template('pricing.html', pub_key=config.STRIPE_PUBLIC_KEY, title="Pricing")

@app.route('/pay', methods=['POST']) 
def pay():
    customer = stripe.Customer.create(email=request.form['stripeEmail'], source=request.form['stripeToken'])
    charge = stripe.Charge.create(
            customer= customer.id, 
            amount= 1200,
            currency= 'usd',
            description= 'One Month Subscription'
        )
    return redirect(url_for('finish'))

paypalrestsdk.configure({
  "mode": "sandbox", # sandbox or live
  "client_id": "EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM", #change to api and secret keys with real accounts
  "client_secret": "EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM" })

@app.route('/paypal', methods=['POST'])
def paypal():
    data = ['paypal', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    payment = paypalrestsdk.Payment({
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"},
    "redirect_urls": {
        "return_url": "http://localhost:3000/payment/execute",
        "cancel_url": "http://localhost:3000/"},
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "12345",
                "price": "12.00",
                "currency": "USD",
                "quantity": 1}]},
        "amount": {
            "total": "12.00",
            "currency": "USD"},
        "description": "This is the payment transaction description."}]})
    if payment.create():
        print('Payment Success!')
    else:
        print(payment.error)

    return jsonify({'paymentID' : payment.id})

@app.route('/execute', methods=['POST'])
def execute():
    success = False
    payment = paypalrestsdk.Payment.find(request.form['paymentID'])
    if payment.execute({'payer_id' : request.form['payerID']}):
        print('Execution Success!')
        success = True
    else:
        print(payment.error)
    return jsonify({'sucess' : sucess})


@app.route('/finish') 
def finish():
    data = ['reached checkout', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    return render_template('finish.html', title="Finish Checkout")

@app.route('/video')
def video():
    data = ['video', sessionID, str(datetime.now().replace(microsecond=0))]
    parseVisitor(data)
    return render_template('video.html', title='Video')