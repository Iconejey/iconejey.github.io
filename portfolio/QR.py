import socket, qrcode, os

ip = socket.gethostbyname(socket.gethostname())

qr = qrcode.QRCode( version = 1, error_correction = qrcode.constants.ERROR_CORRECT_L, box_size = 1, border = 1)
qr.add_data(f'https://the-mute-bow.com/pwa')
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save('the-mute-bow-qrcode.png')