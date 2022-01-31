export let prodModal = null;
export default {
  data() {
    return {
      api_url: "https://vue3-course-api.hexschool.io/v2",
      api_path: "letcla",
      categories: ["蛋糕", "甜甜圈", "馬卡龍"],
      isLoading: false,
    };
  },
  props: ["prod", "isNew"],
  template: "#prodModalComponent",
  methods: {
    upProdBtn() {
      this.isLoading = true;
      let api = `${this.api_url}/api/${this.api_path}/admin/product`;
      let httpMethod = "post";

      if (!this.isNew) {
        api = `${this.api_url}/api/${this.api_path}/admin/product/${this.prod.id}`;
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
};
