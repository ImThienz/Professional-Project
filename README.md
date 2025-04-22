# Web bán - đọc truyện trực tuyến
Nhóm 6 - Khoa CNTT - Học viện Hàng không Việt Nam - 010100086402
# FITVAA  
# MERN Stack Project (MongoDB Compass)
[Cài lại module trong backend sau khi clone từ github về:]  
'Remove-Item -Recurse -Force .\node_modules'  
'npm i'  
'npm start'  

[frontend:]  
'npm i'  
'npm start'  
  
[backend/.env:]   
SECRET_KEY=your_secret_key  
JWT_SECRET=your_jwt_secret  
VNP_TMN_CODE=your_vnp_tmn_code  
VNP_HASH_SECRET=your_vnp_hash_secret  
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html  
VNP_RETURN_URL=http://localhost:8080/api/vnpay/vnpay_return  
VNP_RETURN_URL_CHAPTER=http://localhost:8080/api/chapter-payments/vnpay-return  
FRONTEND_URL=http://localhost:3000  
  
[backend/config/default.json:]  
  "vnp_TmnCode": "your-tmn-code",  
  "vnp_HashSecret": "your-hash-secret",  

[backend/app.js:]  
`mongoose .connect("mongodb://localhost:27017/<your-name-connection>")`  
  
## 🎬 Demo Giao diện
![Demo](demo.gif)

# MEMBERS:
- Nguyễn Hồ Trường Giang - 2154810037 (LEADER)  
- Vũ Thành Đạt - 2254810175  
- Nguyễn Văn Sơn - 2254810168  
- Trần Đình Đạt - 2154810039  
- Nguyễn Gia Hy - 2154810005

# Notes:
- branch [master]: prj on Android Studio (Java)  
- branch [report]: my report
