export default {

    webparts: [

        {
            title: "Total Active Customer",
            schemaname: "members",
            query: [
                {
                    "$project": {
                        "_id": "$_id",
                        "status": "$status"
                    }
                },
                {
                    "$match": {
                        "status": "active"
                    }
                },
                {
                    "$group" : {
                        "_id" : 1,
                        "total" : {
                            "$sum" : 1
                        }
                    }
                }
            ]
        },
        {
            title: "Total Active Users",
            schemaname: "users",
            query: [
                {
                    "$project": {
                        "_id": "$_id",
                        "status": "$status"
                    }
                },
                {
                    "$match": {
                        "status": "active"
                    }
                },
                {
                    "$group" : {
                        "_id" : 1,
                        "total" : {
                            "$sum" : 1
                        }
                    }
                }
            ]
        },

    ]
    
}

