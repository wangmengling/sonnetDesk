import { observable, computed, action, autorun } from "mobx";
import Fetch from "../utils/Fetch";
import { message } from "antd";
class BaseStore {
    @observable dataList = [];
    @observable searchParams = {};
    @observable pageIndex = 0;
    @observable pageCount = 0;
    @observable pageIsMoreData = false;
    @observable count = 0;
    @observable pageSize = 10;


    /**
        * Observable properties.
        * @property {map} detailData - Detail info.
    */
    @observable detailData = {};

    @observable loading: boolean = false;
    @observable addLoading: boolean = false;

    @observable visible: boolean = false;

    @observable updateData = {};

    @action list(url) {
        this.loading = true;
        this.searchParams["pageIndex"] = this.pageIndex;
        this.searchParams["pageSize"] = this.pageSize;
        console.log(this.searchParams);
        console.log("-----------------");
        Fetch.post(url,this.searchParams).then((response) => {
            let data = response.data;
            // console.log(data);
            if (data.code == 1 && data.data) {
                if (this.pageIsMoreData) {
                    if (this.pageIndex == 0) {
                        this.dataList = data.data["list"];
                    } else {
                        this.dataList = this.dataList.concat(data.data["list"]);
                    }
                    if (this.dataList >= data.data["count"]) {
                        this.pageIsMoreData = false;
                    }
                }else {
                    this.dataList = data.data["list"];
                }
                this.pageCount = data.data["pageCount"];
                this.count = data.data["count"];
                console.log(data.data.list);
                console.log(this.dataList)
            }
            console.log(data.code)
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            message.info(error.message);
            // console.log(error);
        });
    }

    @action allList(url) {
        this.loading = true;
        Fetch.post(url,this.searchParams).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.dataList = data.data["list"];
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            message.info(error.message);
        });
    }

    @action allList(url,callback) {
        this.loading = true;
        Fetch.post(url,this.searchParams).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                callback(data.data["list"],null)
            }else {
                callback([],error)
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            callback([],error)
        });
    }

    @action add(url, params) {
        this.addLoading = true;
        Fetch.post(url,params).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.dataList.push(data.data);
                this.visible = false;
            }
            message.info(data.message);
            this.addLoading = false;
        }).catch((error) => {
            // this.visible = false;
            this.addLoading = false;
            message.info(error.message);
        });
    }

    @action detailById(url,_id) {
        this.detail(url, {"_id":_id});
    }

    @action detail(url,params) {
        this.loading = true;
        console.log(params)
        Fetch.post(url,params).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.detailData = data.data;
            }
            this.loading = false;
            // message.info(data.message);
        }).catch((error) => {
            this.loading = false;
            message.info(error.message);
        });
    }
    
    @action updateById(url,_id) {
        this.update(url, {_id:_id});
    }

    @action update(url,params) {
        this.addLoading = true;
        Fetch.post(url,params).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.visible = false;
            }
            this.addLoading = false;
        }).catch((error) => {
            this.addLoading = false;
            message.info(error.message);
        });
    }

    @action updateByIdAndGetList(url,_id) {
        this.update(url, {_id:_id});
    }

    @action updateAndGetList(url,params) {
        this.addLoading = true;
        Fetch.post(url,params).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.visible = false;
            }
            message.info(data.message);
            this.addLoading = false;
            this.list();
        }).catch((error) => {
            this.addLoading = false;
            message.info(error.message);
        });
    }

    @action deleteById(url,_id) {
        this.delete(url,{_id:_id});
    }

    @action delete(url,params) {
        this.addLoading = true;
        Fetch.post(url,params).then((response) => {
            let data = response.data;
            if (data.code == 1 && data.data) {
                this.visible = false;
            }
            message.info(data.message);
            this.addLoading = false;
            this.list();
        }).catch((error) => {
            this.addLoading = false;
            message.info(error.message);
        });
    }

    @computed get getAddLoading() {
        return this.addLoading;
    }
}
export default BaseStore;