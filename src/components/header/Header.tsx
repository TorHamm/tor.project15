import { useEffect, useState } from "react";
import logo from "/src/assets/images/logo.svg";
import arrow from "/src/assets/images/icon-arrow-down.svg";

const Header = () => {
  const [font, setFont] = useState("Sans Serif");

  const handleCheckFont = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget as HTMLLIElement;
    setFont(target.innerText);
  };

  const [darkTheme , setDarktheme] = useState(()=>{
    const savedTheme = localStorage.getItem('isDarkTheme')
    return savedTheme ? JSON.parse(savedTheme) : false;
  })

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarktheme(newTheme);
    localStorage.setItem('isDarkTheme' , JSON.stringify(newTheme));
  };

  const fontFormat = `font-${font.toLowerCase().replace(' ', '-')}`;

  const getFontFamily = (font: string) => {
    switch (font) {
        case 'Sans Serif':
          return "'inter', sans-serif";
        case 'Serif':
          return "'lora', serif";
        case 'Mono':
          return "'inconsolata', monospace";
        default:
          return "'inter', sans-serif";
      }
  }

  useEffect(()=>{
    document.body.style.fontFamily = getFontFamily(font)
    if (darkTheme) {
      document.body.classList.add('darkTheme')
      document.body.classList.remove('whiteTheme')
    } else {
      document.body.classList.add('whiteTheme')
      document.body.classList.remove('darkTheme')
    }
  } , [font , darkTheme])

  return (
    <header>
      <img src={logo} className='logo'></img>
      <div className='fontAndTheme'>
        <div className='fontSelector'>
          <div className='fontDisplay'>
            <p className={fontFormat}>
              <b>{font}</b>
            </p>
            <img src={arrow}></img>
          </div>
          <div className='selector'>
            <ul>
              <li onClick={handleCheckFont} className="font-sans-serif"><b>Sans Serif</b></li>
              <li onClick={handleCheckFont} className="font-serif"><b>Serif</b></li>
              <li onClick={handleCheckFont} className="font-mono"><b>Mono</b></li>
            </ul>
          </div>
        </div>
        <hr></hr>
        <div className='themeSelector'>
          <label className='switch'>
            <input type='checkbox' onChange={toggleTheme} checked={darkTheme}></input>
            <span className='switchButton'></span>
          </label>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 22 22'>
            <path
              fill='none'
              stroke={darkTheme ? '#A445ED' : '#838383'}
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z'
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
