import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import marked from "marked";
import hljs from "highlightjs";
import "highlightjs/styles/nord.css";

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

  useEffect(() => {
    hljs.initHighlighting();
    hljs.initHighlighting.called = false;
  });

  const saveMemo = (m) => {
    setMemo(m);
  };

  return (
    <div className="homeItems">
      <div className="homeMemo">
        <div className="homeMemoBoxEdit">
          <SimpleMDE
            value={memo}
            //options={options}
            onChange={(e) => saveMemo(e)}
          />
        </div>
        <div className="homeMemoBoxView">
          <span dangerouslySetInnerHTML={{ __html: marked(memo) }} />
        </div>
      </div>

      <form>
        <textarea></textarea>
      </form>
    </div>
  );
};

export default Home;