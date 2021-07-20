import React, { useState, useEffect } from "react";
import axios from "axios";


const Home = () => {

    //const [response, setResponse] = useState('A');


    useEffect(() => {
        const { Client } = require('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_API_KEY });
        
        (async () => {
            const response = await notion.databases.retrieve({ database_id: process.env.NOTION_TASKS_DB });
            console.log(response);
          })();

    }, []);


    return (
        <div>

            <div className="homeItems">
                <h1>ホーム</h1>
                <p>現在は22:00です。</p>
            </div>

        </div>
    );
}
    
export default Home;