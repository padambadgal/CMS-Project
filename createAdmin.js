// const mongoose = require("mongoose");
// const User = require("./models/user");

// mongoose.connect("mongodb://127.0.0.1:27017/news-cms-blog");

// async function createAdmin() {
//     try {
//         // Delete old admin if it exists
//         await User.deleteOne({ username: "admin" });

//         // Create new admin
//         await User.create({
//             fullname: "Admin User",
//             username: "admin",
//             password: "admin123",
//             role: "admin"
//         });

//         console.log("Admin Created Successfully");
//         process.exit();
//     } catch (err) {
//         console.log(err);
//     }
// }

// createAdmin();