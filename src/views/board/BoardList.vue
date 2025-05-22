<template>
  <div class="board-list">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
    </div>
    <ag-grid-vue
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
        class="ag-theme-alpine"
        style="height: 500px; width: 100%;"
        :columnDefs="columnDefs"
        :rowData="list"
        :pagination="true"
        :paginationPageSize="size"
        :suppressCellFocus="true"
    ></ag-grid-vue>
    <div class="pagination w3-bar w3-padding-16 w3-small" v-if="paging.total_list_cnt > 0">
      <span class="pg">
      <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-bar-item w3-border">&lt;&lt;</a>
      <a href="javascript:;" v-if="paging.start_page > 10" @click="fnPage(`${paging.start_page-1}`)"
         class="prev w3-button w3-bar-item w3-border">&lt;</a>
      <template v-for=" (n,index) in paginavigation()">
          <template v-if="paging.page==n">
              <strong class="w3-button w3-bar-item w3-border w3-green" :key="index">{{ n }}</strong>
          </template>
          <template v-else>
              <a class="w3-button w3-bar-item w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">{{ n }}</a>
          </template>
      </template>
      <a href="javascript:;" v-if="paging.total_page_cnt > paging.end_page"
         @click="fnPage(`${paging.end_page+1}`)" class="next w3-button w3-bar-item w3-border">&gt;</a>
      <a href="javascript:;" @click="fnPage(`${paging.total_page_cnt}`)" class="last w3-button w3-bar-item w3-border">&gt;&gt;</a>
      </span>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default {
  components: {
    AgGridVue
  },
  data() { //변수생성
    return {
      requestBody: {}, //리스트 페이지 데이터전송
      list: [], //리스트 데이터
      no: '', //게시판 숫자처리
      gridApi: null,
      columnApi: null,
      columnDefs: [
        { headerName: "No", field: "id", width: 70, sortable: true },
        {
          headerName: "제목",
          field: "title",
          flex: 1,
          sortable: true,
          cellRenderer: params => {
            return `<a href="javascript:void(0);">${params.value}</a>`;
          }
        },
        { headerName: "작성자", field: "author", width: 120, sortable: true },
        { headerName: "등록일시", field: "created_at", width: 150, sortable: true }
      ],
      paging: {
        block: 0,
        end_page: 0,
        next_block: 0,
        page: 0,
        page_size: 0,
        prev_block: 0,
        start_index: 0,
        start_page: 0,
        total_block_cnt: 0,
        total_list_cnt: 0,
        total_page_cnt: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      keyword: this.$route.query.keyword,
      paginavigation: function () { //페이징 처리 for문 커스텀
        let pageNumber = [] //;
        let start_page = this.paging.start_page;
        let end_page = this.paging.end_page;
        for (let i = start_page; i <= end_page; i++) pageNumber.push(i);
        return pageNumber;
      }
    }
  },
  created() {
    // 데이터 초기 로드는 created에서 수행
    this.list = []; // 빈 배열로 초기화
  },
  mounted() {
    setTimeout(() => {
      this.fnGetList();
    }, 0);
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      if (this.list && Object.keys(this.list).length > 0) {
        this.gridApi.setRowData(this.list);
      }

      // 제목 클릭 이벤트 처리
      setTimeout(() => {
        if (this.gridApi) {
          this.gridApi.addEventListener('cellClicked', this.onCellClicked);
        }
      }, 100);
    },

    onCellClicked(params) {
      // 제목 열 클릭 시 상세 페이지로 이동
      if (params.column.colId === 'title') {
        this.fnView(params.data.id);
      }
    },
    fnGetList() {
      this.requestBody = { // 데이터 전송
        keyword: this.keyword,
        page: this.page,
        size: this.size
      }

      this.$axios.get(this.$serverUrl + "/board/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {

        this.list = res.data  //서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용할 수 있다.

        if (this.gridApi) {
          this.gridApi.setRowData(this.list);
        }
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },
    fnView(id) {
      this.requestBody.id = id
      this.$router.push({
        path: './detail',
        query: this.requestBody
      })
    },
    fnWrite() {
      this.$router.push({
        path: './write'
      })
    },
    fnPage(n) {
      if (this.page !== n) {
        this.page = n
        this.fnGetList()
      }
    }
  }
}
</script>

<style>
/* AG Grid 스타일 */
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";
</style>