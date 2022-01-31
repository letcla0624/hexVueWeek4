import page from "./page.js";

const { createApp } = Vue;
const api_url = "https://vue3-course-api.hexschool.io/v2";
const api_path = "letcla";
let prodModal = "";
``;
let delModal = "";
const app = createApp({
  data() {
    return {
      showErr: false,
      del: false,
      errTitle: "",
      delSuccess: true,
      isLoading: false,
      isNew: true,
      products: [],
      newTemp: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  components: {
    page,
  },
  methods: {
    // 切換商品圖片
    // changeImg(e) {
    //   this.temp.imageUrl = e.target.currentSrc;
    // },
    // 驗證 token
    checkLogin() {
      axios
        .post(`${api_url}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          this.isLoading = false;
          // 驗證失敗跳出 modal 訊息
          this.showErr = true;
          this.errTitle = err.response.data.message;
        });
    },
    // 取得商品
    getData(page = 1) {
      axios
        .get(`${api_url}/api/${api_path}/admin/products?page=${page}`)
        .then((res) => {
          this.isLoading = false;
          this.products = res.data.products;
          //  取得分頁
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          this.isLoading = false;
          console.dir(err);
        });
    },

    // 開啟 modal
    openModal(txt, item) {
      if (txt === "create") {
        this.isNew = true;
        this.newTemp = {
          imagesUrl: [],
        };
        prodModal.show();
      } else if (txt === "edit") {
        this.isNew = false;
        this.newTemp = { ...item };
        prodModal.show();
      } else {
        this.isNew = false;
        this.newTemp = { ...item };
        delModal.show();
      }
    },
    // 關閉 modal 訊息
    closeDel() {
      this.del = false;
      this.getData();
    },
    // 跳出成功 modal 訊息
    successMsg(res) {
      this.isLoading = false;
      this.del = true;
      this.delSuccess = res.data.success;
      this.errTitle = res.data.message;
      this.getData();
    },
    // // 跳出失敗 modal 訊息
    errorMsg(err) {
      this.isLoading = false;
      this.del = true;
      this.delSuccess = err.response.data.success;
      this.errTitle = err.response.data.message;
    },
    // 關閉驗證失敗 modal 訊息，並重新導回登入頁
    closeErr() {
      this.showErr = false;
      window.location = "login.html";
    },
  },
  created() {
    this.isLoading = true;
    // 取得 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
});

app.use(VueLoading.Plugin);
app.component("loading", VueLoading.Component);

// 新增／更新產品 modal 元件
app.component("prod-modal", {
  data() {
    return {
      categories: ["蛋糕", "甜甜圈", "馬卡龍"],
    };
  },
  props: ["prod", "isNew"],
  template: "#prodModalComponent",
  methods: {
    upProdBtn() {
      let api = `${api_url}/api/${api_path}/admin/product`;
      let httpMethod = "post";

      if (!this.isNew) {
        api = `${api_url}/api/${api_path}/admin/product/${this.prod.id}`;
        httpMethod = "put";
      }

      axios[httpMethod](api, { data: this.prod })
        .then((res) => {
          this.$emit("success-msg", res);
          prodModal.hide();
        })
        .catch((err) => {
          this.$emit("error-msg", err);
        });
    },
    // modal 裡新增其餘圖片
    addPics() {
      this.prod.imagesUrl.push("");
    },
    // modal 裡刪除其餘圖片
    delPics(key) {
      this.prod.imagesUrl.splice(key, 1);
    },
  },
  mounted() {
    prodModal = new bootstrap.Modal(document.querySelector("#prodModal"));
  },
});

// 刪除產品 modal 元件
app.component("del-modal", {
  props: ["prod"],
  template: "#delModal",
  methods: {
    delProdBtn(prodId) {
      axios
        .delete(`${api_url}/api/${api_path}/admin/product/${prodId}`)
        .then((res) => {
          this.$emit("success-msg", res);
          delModal.hide();
        })
        .catch((err) => {
          this.$emit("error-msg", err);
        });
    },
  },
  mounted() {
    delModal = new bootstrap.Modal(document.querySelector("#delModal"));
  },
});
app.mount("#app");
