const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  logout,
  singleUser,
  userProfile,
  allUserProfile,
} = require("../controllers/auth.controller");
const { isAuthenticated, isAdmin, isEditor } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/getme", isAuthenticated, userProfile);

router.get("/getAll", allUserProfile);
router.get("/getAdmin", isAuthenticated, isAdmin, userProfile);
router.get("/getEditor", isAuthenticated, isEditor, userProfile);
router.get("/user/:id", singleUser);

// test nested loop

const MockupData = require("../mockup/data.json");
router.post("/loop", (req, res, next) => {
  const { data1, data2, data3 } = req.body;
  //console.log("data1---> ", data1);

  const numbers = [65, 44, 12, 4];
  numbers.forEach((item, index, arr) => {
    //console.log(`arr--->${index}`, arr);
    //console.log(`item--->${index}`, item);
    arr[index] = item + 1;
    // console.log("a---> ", (arr[index] = item * 10));
    return;
  });
  console.log("numbers---> ", numbers);
  res.status(200).send(numbers);
});

router.post("/loop1", (req, res, next) => {
  const { data1, data2, data3 } = req.body;
  //console.log("data1---> ", data1);

  MockupData.forEach((item, index, arr) => {
    arr[index] = item.value + 1;

    return;
  });
  //console.log("MockupData---> ", MockupData);
  //var myJsonString = JSON.stringify(MockupData);
  // var myJsonString = JSON.parse(JSON.stringify(MockupData));
  var myJsonString = Object.assign({}, MockupData);
  console.log("myJsonString---> ", myJsonString);
  res.status(200).send(myJsonString);
});

router.post("/loop2", (req, res, next) => {
  const { data1, data2, data3 } = req.body;
  //console.log("data1---> ", data1);

  const arr1 = [];
  const arr2 = [];
  const arr3 = [];
  MockupData.forEach((item) => {
    arr1.push(item.value + data1);
    arr2.push(item.value + data2);
    arr3.push(item.value + data3);

    //return;
  });
  //console.log("data---> ", data);
  var myJsonString1 = Object.assign({}, arr1);
  var myJsonString2 = Object.assign({}, arr2);
  var myJsonString3 = Object.assign({}, arr3);

  res.status(200).json([
    {
      ยอดที่เสนอราคา_ชุด: data1,
      ราคาเสนอเรท_1: myJsonString1[0],
      ราคาเสนอเรท_2: myJsonString1[1],
      ราคาเสนอเรท_3: myJsonString1[2],
    },
    {
      ยอดที่เสนอราคา_ชุด: data2,
      ราคาเสนอเรท_1: myJsonString2[0],
      ราคาเสนอเรท_2: myJsonString2[1],
      ราคาเสนอเรท_3: myJsonString2[2],
    },
    {
      ยอดที่เสนอราคา_ชุด: data3,
      ราคาเสนอเรท_1: myJsonString3[0],
      ราคาเสนอเรท_2: myJsonString3[1],
      ราคาเสนอเรท_3: myJsonString3[2],
    },
  ]);
});

module.exports = router;
