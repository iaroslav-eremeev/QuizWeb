class ResponseResult {
    constructor(response_code, results) {
        this.response_code = response_code;
        this.results = results;
    }

    get response_code() {
        return this._response_code;
    }

    set response_code(value) {
        this._response_code = value;
    }

    get results() {
        return this._results;
    }

    set results(value) {
        this._results = value;
    }
}

export { ResponseResult };
