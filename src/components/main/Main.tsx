/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import searchIcon from "/src/assets/images/icon-search.svg"
import playIcon from "/src/assets/images/icon-play.svg"
import newWindowIcon from "/src/assets/images/icon-new-window.svg"


const Main = () => {
    const [keyword, setKeyword] = useState('keyboard');
    const [wordData, setWordData] = useState(null);
    const [inputError, setInputError] = useState(false);
    const [newWord, setNewWord] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleSubmit = async () => {
        if (keyword !== "") {
            setInputError(false);
            setNewWord(false);
            try {
                const response = await fetch(
                    `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonData = await response.json();
                setWordData(jsonData);
            } catch (error) {
                setWordData(null);
            }
        } else {
            setInputError(true);
            setWordData(null);
        }
    };

    const handleKeyDown = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleWordClick = (event: any) => {
        const target = event.currentTarget as HTMLLIElement;
        setKeyword(target.innerText);
        setNewWord(true);
    };
    

    const handleAudioPlay = (phonetics: { audio?: string }[]) => {
        const audioUrl = phonetics.find(phonetic => phonetic.audio)?.audio;
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
            console.error('No audio URL found');
        }
    }

    useEffect(() => {
        handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newWord])



    return (
        <main>
            <div className={`searchContainer ${inputError ? 'inputError' : ''}`} >
                <div className={`searchBar`} onKeyDown={handleKeyDown}>
                    <input
                        onChange={handleInput}
                        value={keyword}
                        placeholder='Search for any word...'></input>
                    <button onClick={handleSubmit}>
                        <img src={searchIcon} alt="search"></img>
                    </button>
                </div>
                <label>Whoops, can’t be empty…</label>
            </div>

            {wordData ? (
                <>
                    <div className='displayWord'>
                        <div className='wordTitle'>
                            <h1>{(wordData[0] as any).word}</h1>
                            <h2 className='phonetics'>{(wordData[0] as any).phonetic}</h2>
                        </div>
                        <button className='audioButton' onClick={() => handleAudioPlay((wordData[0] as any).phonetics || [])}>
                            <img src={playIcon} alt="play"></img>
                        </button>
                    </div>
                    <div className='wordData'>
                        {(wordData[0] as any).meanings.map((meaning: any, index: number) => (
                            <div className='dataContainer' key={index}>
                                <div className='partOfSpeech'>
                                    <h3>
                                        <i>{meaning.partOfSpeech}</i>
                                    </h3>
                                    <hr></hr>
                                </div>
                                <ul className="meaning">
                                    <h3>Meaning</h3>
                                    {meaning.definitions.map((def: any, index: number) => (
                                        <li key={index}>
                                            {def.definition}
                                            {def.example && <>
                                                <br/><q>“{def.example}”</q>
                                            </>}
                                        </li>
                                    ))}
                                </ul>
                                {meaning.synonyms && meaning.synonyms.length > 0 && (
                                    <div className="synonyms">
                                        <h3>Synonyms</h3>
                                        <div className="syn">
                                            {meaning.synonyms.map((word: string, index: number) => (
                                                <h3 key={index} className="data" onClick={handleWordClick}>{word}</h3>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {meaning.antonyms && meaning.antonyms.length > 0 && (
                                    <div className="antonyms">
                                        <h3>Antonyms</h3>
                                        <div className="an">
                                            {meaning.antonyms.map((word: string, index: number) => (
                                                <h3 key={index} className="data" onClick={handleWordClick}>{word}</h3>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <hr className="endLine"></hr>
                    </div>
                    <div className='wordSource'>
                        <div className='source'>
                            <p>
                                <small><u>Source</u></small>
                            </p>
                            <a href={(wordData[0] as any).sourceUrls} target='_blank'>
                                <p>
                                    <small>{(wordData[0] as any).sourceUrls}</small>
                                </p>
                                <img src={newWindowIcon}></img>
                            </a>
                        </div>
                    </div>
                </>
            ) : (
                !inputError && keyword !== "" && (
                    <div className="errorMessage">
                        <span>&#128553;</span>
                        <h3>No Definitions Found</h3>
                        <p>
                            Sorry pal, we couldn't find definitions for the word you were looking
                            for. You can try the search again at a later time or head to the web
                            instead.
                        </p>
                    </div>
                )
            )}
        </main>
    );
};

export default Main;
