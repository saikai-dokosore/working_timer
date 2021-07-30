import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import marked from "marked";
import highlight from "highlightjs";
import "highlightjs/styles/dark.css";

const Home = () => {
  const [memo, setMemo] = useState("");

  const options = {
    autofocus: true,
    spellChecker: false,
  };

  useEffect(() => {
    axios
      .get("./memo/memo.txt")
      .then((res) => {
        setMemo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const saveMemo = (m) => {
    setMemo(m);
  };

  return (
    <div className="homeItems">
      <div className="homeTitle">
        <h1>ホーム</h1>
      </div>

      <div className="homeMemo">
        <SimpleMDE
          value={memo}
          options={options}
          onChange={(e) => saveMemo(e)}
        />
      </div>

      <div>
        <span dangerouslySetInnerHTML={{ __html: marked(memo) }} />
      </div>

      <form>
        <textarea></textarea>
      </form>
    </div>
  );
};

export default Home;
