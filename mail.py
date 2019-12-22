
import os
import smtplib
import imghdr
from flaskapp import config
from email.message import EmailMessage

#email login
EMAIL_ADDRESS = config.EMAIL_ADDRESS
EMAIL_PASSWORD = config.EMAIL_PASSWORD

msg = EmailMessage()
msg['Subject'] = 'Test With Image'
msg['From'] = EMAIL_ADDRESS

#insert email to be sent to
msg['To'] = ''
msg.set_content('Image attached below.')

#for attaching images(enter image names)
files = ['images/test1.png']
for file in files:
	with open(file, 'rb') as f:
		file_data = f.read()
		file_type = imghdr.what(f.name)
		file_name = f.name

	msg.add_attachment(file_data, maintype='image', subtype=file_type, filename=file_name)

#for attaching pdfs(enter pdf file names)
"""
pdfs = ['']
for pdf in pdfs:
	with open(pdf, 'rb') as f:
		file_data = f.read()
		file_name = f.name

	msg.add_attachment(file_data, maintype='application', subtype='octet-string', filename=file_name)
"""

with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
	smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

	smtp.send_message(msg)