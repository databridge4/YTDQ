import React, {useState} from 'react';
import './Form.css'

const Form = ({currentLink, currentUrl, setPrompt, prompt, type, setData}) => {
    const [url, setUrl] = useState(currentLink);
    const changeUrl = (e) => {
        e.preventDefault();
        setUrl(e.target.value)
    }
    const changePrompt = (e) => {
        e.preventDefault();
        setPrompt(e.target.value)
    }
    const submitFormTranscript = (e) => {
        if (prompt !== ''){
            e.preventDefault();
            currentUrl(url)
            setPrompt(prompt)
            setData('')
        }else {
            e.preventDefault();
            currentUrl(url)
            setPrompt('Find quotes and add time stamps to them')
            setData('')
        }


    }
    const submitFormDownloader = (e) => {
        e.preventDefault();
        currentUrl(url)
    }

    if (type === 'transcript') {
        return (
            <form className={'form'} onSubmit={submitFormTranscript}>
                <label>Prompt</label>
                <div className={'Transcript'}>
                    <input className={'prompt'} type={'text'} placeholder={'Find quotes and add time stamps to them'} value={prompt}
                           onChange={changePrompt}/>
                    <p>:"Transcript"</p>
                </div>
                <label>Video Link</label>
                <input type={'url'} placeholder={'Link'} value={url} onChange={changeUrl}/>
                <button className="bn submit-button" type={'submit'}>{"Get a quote"}</button>

            </form>
        );
    } else if (type === 'videoDownloader') {
        return (
            <form className={'form'} onSubmit={submitFormDownloader}>
                <label>Video Link</label>
                <input type={'url'} placeholder={'Link'} value={url} onChange={changeUrl}/>
                <button className="bn submit-button" type={'submit'}>{"Get Video"}</button>
            </form>
        );
    }

};

export default Form;
