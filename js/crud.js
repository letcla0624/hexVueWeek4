import page from "./page.js";
import prodComponent, { prodModal } from "./prodComponent.js";
import delComponent, { delModal } from "./delComponent.js";

const { createApp } = Vue;
const api_url = "https://vue3-course-api.hexschool.io/v2";
const api_path = "letcla";
const app = createApp({
  data() {
    return {
      showErr: false,
      del: false,
      showTitle: "",
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
    prodComponent,
    delComponent,
  },
  methods: {
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
          this.showTitle = err.response.data.message;
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
        this.newTemp = JSON.parse(JSON.stringify(item));
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
      this.showTitle = res.data.message;
      this.getData();
    },
    // 跳出失敗 modal 訊息
    errorMsg(err) {
      this.isLoading = false;
      this.del = true;
      this.delSuccess = err.response.data.success;
      this.showTitle = err.response.data.message;
    },
    // 關閉驗證失敗 modal 訊息，並重新導回登入頁
    closeErr() {
      this.showErr = false;
      window.location = "login.html";
    },
    // 登出
    logOut() {
      this.isLoading = true;
      axios
        .post(`${api_url}/logout`)
        .then((res) => {
          this.isLoading = false;
          window.location = "login.html";
        })
        .catch((err) => {
          console.dir(err);
        });
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
app.mount("#app");
