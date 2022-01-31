export default {
  props: ["pages"],
  template: `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" 
          :class="{'disabled': pages.current_page === 1}"
          @click="emitPage(pages.current_page - 1)">
          <a class="page-link" href="#" aria-label="Previous">
            <i class="bi bi-arrow-left-short" aria-hidden="true"></i>
          </a>
        </li>      
        <li class="page-item" 
          :class="{'active': page === pages.current_page}" 
          v-for="(page, idx) in pages.total_pages" 
          :key="idx">
          <a class="page-link" href="#" 
            @click.prevent="emitPage(page)">{{page}}
          </a>
        </li>
        <li class="page-item" 
          :class="{'disabled': pages.current_page === pages.total_pages}" 
          @click="emitPage(pages.current_page + 1)">
          <a class="page-link" href="#" aria-label="Next">
          <i class="bi bi-arrow-right-short" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </nav>
  `,
  methods: {
    emitPage(page) {
      this.$emit("emit-page", page);
    },
  },
};
