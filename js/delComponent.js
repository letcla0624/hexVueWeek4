export let delModal = null;
export default {
  data() {
    return {
      api_url: "https://vue3-course-api.hexschool.io/v2",
      api_path: "letcla",
    };
  },
  props: ["prod"],
  template: "#delModal",
  methods: {
    delProdBtn(prodId) {
      let loader = this.$loading.show();
      axios
        .delete(`${this.api_url}/api/${this.api_path}/admin/product/${prodId}`)
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
};
