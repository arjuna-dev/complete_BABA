import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import TextSelector from 'text-selection-react'
import allDscrsList from '../assets/bookList'
import BurgerMenu from './svg/BurgerMenu'
import ArrowDown from './svg/ArrowDown'
import ArrowBack from './svg/ArrowBack'
import ArrowNext from './svg/ArrowNext'
import ArrowUp from './svg/ArrowUp'
import axios from 'axios';
import Star from './svg/Star'
import StarSelected from './svg/StarSelected'
import * as discourse from './discourse.module.css';
import * as menu from './menu.module.css';
import * as lists from './lists.module.css';
import * as q from './quotes.module.css';

export default function Discourse({discourseTitle="Actions_and_Their_Results_Karma_and_Karmaphala"}) {
  
  const [currentDiscourse, setcurrentDiscourse] = useState()
  

  const [favDscrsList, setfavDscrsList] = useState([])
  const [funnyDscrsList, setfunnyDscrsList] = useState([])
  const [devotionalDscrsList, setdevotionalDscrsList] = useState([])
  const [revDscrsList, setrevDscrsList] = useState([])
  const [jinaniDscrsList, setjinaniDscrsList] = useState([])
  const [badDscrsList, setbadDscrsList] = useState([])
  const [readDscrsList, setreadDscrsList] = useState([])

  const [displayLists, setdisplayLists] = useState(false)
  const [displayQuotes, setdisplayQuotes] = useState(false)
  const [displayMenu, setdisplayMenu] = useState(true)
  const [displayTags, setdisplayTags] = useState(false)

  const [quotes, setquotes] = useState([])
  const [htmlData, sethtmlData] = useState()
  const [nextDiscourse, setnextDiscourse] = useState()
  const [prevDiscourse, setprevDiscourse] = useState()
  
  const [isFav, setisFav] = useState()
  const [isFunny, setisFunny] = useState()
  const [isDevotional, setisDevotional] = useState()
  const [isRev, setisRev] = useState()
  const [isJinani, setisJinani] = useState()
  const [isBad, setisBad] = useState()
  const [isRead, setisRead] = useState()

  const [currentList, setcurrentList] = useState(allDscrsList)
  const [currentListTitle, setcurrentListTitle] = useState("All Discourses")

  useEffect(() => {
    axios({
      method: 'get',
      url: process.env.PUBLIC_URL + "assets/html_files/html_files/" + discourseTitle + ".html",
      timeout: 4000,
    })
    .then(response => sethtmlData(response.data))
    .catch(error => console.error('timeout exceeded'))

    let nextIndex = allDscrsList.indexOf(window.location.pathname.substr(1)) + 1
    let prevIndex = allDscrsList.indexOf(window.location.pathname.substr(1)) - 1

    setcurrentDiscourse(window.location.pathname.substr(1))
    setnextDiscourse(allDscrsList[nextIndex])
    setprevDiscourse(allDscrsList[prevIndex])
    updateQuotesFromLocalStorage()
    updateListFromLocalStorage("funnyDscrsList", setfunnyDscrsList)
    updateListFromLocalStorage("devotionalDscrsList", setdevotionalDscrsList)
    updateListFromLocalStorage("revDscrsList", setrevDscrsList)
    updateListFromLocalStorage("jinaniDscrsList", setjinaniDscrsList)
    updateListFromLocalStorage("badDscrsList", setbadDscrsList)
    updateListFromLocalStorage("readDscrsList", setreadDscrsList)
    updateListFromLocalStorage("favDscrsList", setfavDscrsList)
  }, [])

  useEffect(() => {
    updateIsInList("favDscrsList", setisFav)
    updateIsInList("funnyDscrsList", setisFunny)
    updateIsInList("devotionalDscrsList", setisDevotional)
    updateIsInList("revDscrsList", setisRev)
    updateIsInList("jinaniDscrsList", setisJinani)
    updateIsInList("badDscrsList", setisBad)
    updateIsInList("readDscrsList", setisRead)
  }, [currentDiscourse])

  const getFromLocalStorage = (key) => {
    const items = JSON.parse(localStorage.getItem(key))
    return items
  }

  const addCurrentToLocalStorage = (key) => {
    let date = new Date().toISOString()
    if (localStorage.getItem(key)){
      const starredItems = getFromLocalStorage(key)
      localStorage.setItem(key, JSON.stringify([...starredItems, {bookName: currentDiscourse, date:date}]));
    } else {
      localStorage.setItem(key, JSON.stringify([{bookName: currentDiscourse, date:date}]));
    }
  }

  const deleteCurrentFromLocalStorage = (key) => {
    if (localStorage.getItem(key) && localStorage.getItem(key).length>0){
      let items = getFromLocalStorage(key)
      items = items.filter(item => item.bookName !== currentDiscourse)
      localStorage.setItem(key, JSON.stringify([...items]));
    }
  }

  const updateIsInList = (key, setIsInList) => {
    let items = JSON.parse(localStorage.getItem(key))
    if (items && items.length>0){
      for (let i=0; i<items.length; i++) {
        if (items[i].bookName == currentDiscourse) {
          setIsInList(true)
          break
        } else {
          setIsInList(false)
        }
      }
    } else {
      setIsInList(false)
    }
  }
  
  const updateListFromLocalStorage = (key, setList) => {
    if (localStorage.getItem(key)){
      const favoriteBooks = JSON.parse(localStorage.getItem(key))
      setList([])
      for (let i=0; i<favoriteBooks.length; i++) {
        setList(list => [...list, favoriteBooks[i].bookName])
      }
    }
  }

  const toggleInList = async (isInList, key, setList, setIsInList, list, title) => {

    if (isInList) {
      deleteCurrentFromLocalStorage(key)
      updateListFromLocalStorage(key, setList)
      updateIsInList(key, setIsInList)
    } else {
      addCurrentToLocalStorage(key)
      updateListFromLocalStorage(key, setList)
      updateIsInList(key, setIsInList)
    }
  }
  
  useEffect(() => {
    updateListAndTitle(favDscrsList, "Favorite")
  }, [favDscrsList])
  useEffect (() => {
    updateListAndTitle(funnyDscrsList, "Funny")
  }, [funnyDscrsList])
  useEffect (() => {
    updateListAndTitle(devotionalDscrsList, "Devotional")
  }, [devotionalDscrsList])
  useEffect (() => {
    updateListAndTitle(revDscrsList, "Revolutionary")
  }, [revDscrsList])
  useEffect (() => {
    updateListAndTitle(jinaniDscrsList, "Jinani")
  }, [jinaniDscrsList])
  useEffect (() => {
    updateListAndTitle(badDscrsList, "Didn't Like")
  }, [badDscrsList])
  useEffect (() => {
    updateListAndTitle(readDscrsList, "Read")
  }, [readDscrsList])
  
  const handleClickDeleteQuote = (quote) => {
    let quotesObject;
    if (localStorage.getItem("quotes") && localStorage.getItem("quotes").length>0){
      quotesObject = getFromLocalStorage("quotes")
      quotesObject = quotesObject.filter(item => item.quote !== quote)
      localStorage.setItem("quotes", JSON.stringify([...quotesObject]));
      updateQuotesFromLocalStorage()
    }
  }

  const updateQuotesFromLocalStorage = () => {
    if (localStorage.getItem('quotes')){
      const parsedQuotes = JSON.parse(localStorage.getItem('quotes'))
      setquotes([])
      for (let i=0; i<parsedQuotes.length; i++) {
        setquotes(quotes => [...quotes, parsedQuotes[i].quote])
      }
    }
  }

  const handleClickQuotes = () => {
    setdisplayQuotes(!displayQuotes)
    setdisplayLists(false)
  }

  const handleClickHide = () => {
    setdisplayTags(false)
    setdisplayMenu(false)
    setdisplayLists(false)
    setdisplayQuotes(false)
  }

  const handleClickLists = () => {
    setdisplayLists(!displayLists)
    setdisplayQuotes(false)
  }

  const handleClickUp = () => {
    setdisplayMenu(!displayMenu)
  }

  const handleSelectText = (html, text) => {
    text = "\"" + text + "\""
    let date = new Date().toISOString()
    if (localStorage.getItem("quotes")){
      const quotes = getFromLocalStorage("quotes")
      localStorage.setItem('quotes', JSON.stringify([...quotes, {quote: text, bookName: currentDiscourse, date:date}]));
    } else {
      localStorage.setItem(`quotes`, JSON.stringify([{quote: text, bookName: currentDiscourse, date:date}]));
    }
    updateQuotesFromLocalStorage()
  }
  
  const listRenderer = (list, listName) => {
    return (
      <div>
        <h3 className={lists.listTitle}>{listName}</h3>
        <ul>
            {list.map(function(name, index){
                return <li key={ index }><Link to={"/" + name}>{name}</Link></li>;
              })}
        </ul>
      </div>
    )
  }
  
  const updateListAndTitle = (list, title) => {
    setcurrentList(list)
    setcurrentListTitle(title)
  }

  return (
    <div>

      <TextSelector
              events={[
              {
                  text: 'Add to quotes',
                  handler: handleSelectText
              }
              ]}
              color={'#FDFF8C'}
              colorText={true}
          />

      <div className={discourse.theDiscourse} dangerouslySetInnerHTML={{__html: htmlData}}></div>

      {/* quotes */}
      <div className={displayQuotes?q.quotesWrapper:q.isHidden}>
        <div className={q.bookQuotesDiv}>
          <h3 className={q.quoteTitle}>Quotes</h3>
          <p className={quotes.length>0?q.isHidden:q.notHidden}>Select text in a desktop computer to add it to your quotes</p>
          <ul>
              {quotes.map(function(name, index){
                  return <li key={ name }>
                          <p className={q.listItem}>{name}<span className={q.deletespan} onClick={() => handleClickDeleteQuote(name)}>delete</span></p>  
                        </li>;
                })}
          </ul>
        </div>
      </div>

      {/* lists */}
      <div className={lists.listWrapper}>
        <div className={displayLists?lists.lists:lists.isHidden}>
          <div className={lists.bookListDiv}>
          <h3 className={lists.listTitle}>Lists</h3>
            <button onClick={() => updateListAndTitle(allDscrsList, "All Discourses")}>All Discourses</button>
            <button onClick={() => updateListAndTitle(favDscrsList, "Favorite")}>Favorite</button>
            <button onClick={() => updateListAndTitle(funnyDscrsList, "Funny")}>Funny</button>
            <button onClick={() => updateListAndTitle(devotionalDscrsList, "Devotional")}>Devotional</button>
            <button onClick={() => updateListAndTitle(revDscrsList, "Revolutionary")}>Revolutionary</button>
            <button onClick={() => updateListAndTitle(jinaniDscrsList, "Jinani")}>Jinani</button>
            <button onClick={() => updateListAndTitle(badDscrsList, "Didn't Like")}>Didn't Like</button>
            <button onClick={() => updateListAndTitle(readDscrsList, "Read")}>Read</button>
          </div>
          <div className={lists.bookListDiv}>
            {listRenderer(currentList, currentListTitle)}
          </div>
        </div>
      </div>

      <div onClick={handleClickUp} className={menu.arrowUp}><ArrowUp></ArrowUp></div>

      {/* menu */}
      <div className={displayMenu?menu.containerContainer:menu.isHidden}>
        <div className={menu.menuContainer}>
          <div>
            <button className={menu.menuButton} ><Link to={"/" + prevDiscourse}><ArrowBack /></Link></button>
            <h6 className={menu.menuTitles}>prev</h6>
          </div>
          <div>
            <button className={menu.quotesButton} onClick={handleClickQuotes}>Q</button>
            <h6 className={menu.menuTitles}>quotes</h6>
          </div>
          <div>
            <button className={menu.menuButton} onClick={handleClickLists}><BurgerMenu></BurgerMenu></button>
            <h6 className={menu.menuTitles}>lists</h6>
          </div>
          <div>
            <button className={menu.menuButton} onClick={handleClickHide}><ArrowDown></ArrowDown></button>
            <h6 className={menu.menuTitles}>hide</h6>
          </div>
          <div>
            <button className={menu.menuButton} onClick={() => setdisplayTags(!displayTags)}>{<Star/>}</button>
            <h6 className={menu.menuTitles}>tags</h6>
          </div>
          <div>
            <button className={menu.menuButton}><Link to={"/" + nextDiscourse}><ArrowNext /></Link></button>
            <h6 className={menu.menuTitles}>next</h6>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className={displayTags?lists.tagsWrapper:lists.isHidden}>
        <button onClick={() => toggleInList(isFav, "favDscrsList", setfavDscrsList, setisFav)}>Favorite</button>
        <button onClick={() => toggleInList(isDevotional, "devotionalDscrsList", setdevotionalDscrsList, setisDevotional)}>Devotional</button>
        <button onClick={() => toggleInList(isBad, "badDscrsList", setbadDscrsList, setisBad)}>Didn't Like</button>
        <button onClick={() => toggleInList(isFunny, "funnyDscrsList", setfunnyDscrsList, setisFunny)}>Funny</button>
        <button onClick={() => toggleInList(isJinani, "jinaniDscrsList", setjinaniDscrsList, setisJinani)}>Jinani</button>
        <button onClick={() => toggleInList(isRead, "readDscrsList", setreadDscrsList, setisRead)}>Already Read</button>
        <button onClick={() => toggleInList(isRev, "revDscrsList", setrevDscrsList, setisRev)}>Revolutionary</button>
      </div>
    </div>
  )
}