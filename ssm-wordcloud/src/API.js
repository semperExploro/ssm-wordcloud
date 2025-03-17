import axios from "axios";


class APIGateway {

    constructor() {
        this.baseURL = "https://0vhfzjhkt2.execute-api.us-east-1.amazonaws.com/prod/survey";
    }

    async getSurveyContents() {
        const response = await axios.get(this.baseURL);
        return response.data;
    }

    async putResponse(userInput) {

        var body = {
            "response": userInput
        }

        const response = await axios.post(this.baseURL, body);
        return response.data;
    }

}

export default APIGateway