const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

// Cấu hình để phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Khi truy cập "/", trả về file index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Người chơi đã kết nối");

  socket.on("selectNumber", (data) => {
    io.emit("numberSelected", data);
  });

  socket.on("disconnect", () => {
    console.log("Người chơi đã rời đi");
  });
});

// Sử dụng cổng từ Render hoặc mặc định là 3000
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
