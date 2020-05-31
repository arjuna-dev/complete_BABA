import React, {useState, useEffect} from "react";
import TextSelector from 'text-selection-react'
import bookList from '../assets/bookList'
import BurgerMenu from './svg/BurgerMenu'
import ArrowDown from './svg/ArrowDown'
import ArrowBack from './svg/ArrowBack'
import ArrowNext from './svg/ArrowNext'
import ArrowUp from './svg/ArrowUp'
import GoBack from './svg/GoBack'
import axios from 'axios';
import Star from './svg/Star'
import StarSelected from './svg/StarSelected'
import * as discourse from './discourse.module.css';
import * as menu from './menu.module.css';
import * as lists from './lists.module.css';
import * as q from './quotes.module.css';

export default function Discourse({discourseTitle="Actions_and_Their_Results_Karma_and_Karmaphala"}) {
  
  const [currentPage, setcurrentPage] = useState()
  const [displayLists, setdisplayLists] = useState(false)
  const [displayQuotes, setdisplayQuotes] = useState(false)
  const [displayMenu, setdisplayMenu] = useState(true)
  const [favBooksNames, setfavBooksNames] = useState([])
  const [quotes, setquotes] = useState([])
  const [isStarred, setisStarred] = useState()
  const [htmlData, sethtmlData] = useState()

  useEffect(() => {
    axios({
      method: 'get',
      url: process.env.PUBLIC_URL + "assets/html_files/html_files/" + discourseTitle + ".html",
      timeout: 4000,
    })
    .then(response => sethtmlData(response.data))
    .then(response => console.log(response.data))
    .catch(error => console.error('timeout exceeded'))

    updateQuotesFromLocalStorage()
  }, [])

  useEffect(() => {
    updateBookNamesFromLocalStorage()
    setStarredStatus()
  }, [currentPage])

  const setStarredStatus = () => {
    let starredItems = JSON.parse(localStorage.getItem("starred"))
    if (starredItems && starredItems.length>0){
      for (let i=0; i<starredItems.length; i++) {
        if (starredItems[i].bookNumber == currentPage) {
          setisStarred(true)
          break
        } else {
          setisStarred(false)
        }
      }
    } else {
      setisStarred(false)
    }
  }

  const getFromLocalStorage = (key) => {
    const items = JSON.parse(localStorage.getItem(key))
    return items
  }

  const addCurrentToLocalStorage = () => {
    let date = new Date().toISOString()
    if (localStorage.getItem("starred")){
      const starredItems = getFromLocalStorage("starred")
      localStorage.setItem("starred", JSON.stringify([...starredItems, {bookName: bookList[currentPage], bookNumber: currentPage, date:date}]));
    } else {
      localStorage.setItem("starred", JSON.stringify([{bookName: bookList[currentPage], bookNumber: currentPage, date:date}]));
    }
  }

  const deleteStarredFromLocalStorage = (key) => {
    if (localStorage.getItem(key) && localStorage.getItem(key).length>0){
      let items = getFromLocalStorage(key)
      items = items.filter(item => item.bookNumber !== currentPage)
      localStorage.setItem(key, JSON.stringify([...items]));
    }
  }

  const handleClickDeleteQuote = (quote) => {
    let quotesObject;
    if (localStorage.getItem("quotes") && localStorage.getItem("quotes").length>0){
      quotesObject = getFromLocalStorage("quotes")
      quotesObject = quotesObject.filter(item => item.quote !== quote)
      localStorage.setItem("quotes", JSON.stringify([...quotesObject]));
      updateQuotesFromLocalStorage()
    }
  }

  const updateBookNamesFromLocalStorage = () => {
    if (localStorage.getItem('starred')){
      const favoriteBooks = JSON.parse(localStorage.getItem('starred'))
      setfavBooksNames([])
      for (let i=0; i<favoriteBooks.length; i++) {
        setfavBooksNames(favBooksNames => [...favBooksNames, favoriteBooks[i].bookName])
      }
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

  const starr = () => {
    addCurrentToLocalStorage()
    updateBookNamesFromLocalStorage()
    setStarredStatus()
  }
  
  const unstarr = () => {
    deleteStarredFromLocalStorage("starred")
    updateBookNamesFromLocalStorage()
    setStarredStatus()
  }

  const handleClickNext = () => {
    if (currentPage<bookList.length-1){
      var integer = parseInt(currentPage, 10);
      let newPageNumber = integer + 1
      setcurrentPage(newPageNumber)
    }
  }

  const handleClickBack = () => {
    if (currentPage>0){
      var integer = parseInt(currentPage, 10);
      let newPageNumber = integer - 1
      setcurrentPage(newPageNumber)
    }
  }

  const handleClickQuotes = () => {
    setdisplayQuotes(!displayQuotes)
    setdisplayLists(false)
  }

  const handleClickHide = () => {
    setdisplayMenu(false)
    setdisplayLists(false)
    setdisplayQuotes(false)
  }

  const handleClickLink = (index) => {
    setcurrentPage(index)
    setStarredStatus()
  }

  const handleClickLinkFav = (name) => {
    let index = bookList.indexOf(name)
    setcurrentPage(index)
    setStarredStatus()
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
      localStorage.setItem('quotes', JSON.stringify([...quotes, {quote: text, bookName: bookList[currentPage], date:date}]));
    } else {
      localStorage.setItem(`quotes`, JSON.stringify([{quote: text, bookName: bookList[currentPage], date:date}]));
    }
    updateQuotesFromLocalStorage()
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

      <div>

      </div>

      <div className={discourse.theDiscourse} dangerouslySetInnerHTML={{__html: htmlData}}></div>

      {/* quotes */}
      <div className={displayQuotes?q.quotesWrapper:q.isHidden}>
        <div className={q.bookQuotesDiv}>
          <h3 className={q.quoteTitle}>Quotes</h3>
          {/* <p>Select text in a desktop computer to add it to your quotes</p> */}
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
            <h3 className={lists.listTitle}>Favorite</h3>
              <ul>
                  {favBooksNames.map(function(name, index){
                      return <li key={ name }><button className={lists.listItem} onClick={() => handleClickLinkFav(name)}>{name}</button></li>;
                    })}
              </ul>
          </div>
          <div className={lists.bookListDiv}>
            <h3 className={lists.listTitle}>All Books</h3>
              <ul>
                  {bookList.map(function(name, index){
                      return <li key={ index }><button className={lists.listItem} onClick={() => handleClickLink(index)}>{name}</button></li>;
                    })}
              </ul>
          </div>
        </div>
      </div>


      <div onClick={handleClickUp} className={menu.arrowUp}><ArrowUp></ArrowUp></div>
      {/* menu */}
      <div className={displayMenu?menu.containerContainer:menu.isHidden}>
        <div className={menu.menuContainer}>
          <div>
            <button className={menu.backButton} onClick={handleClickBack}><ArrowBack></ArrowBack></button>
            <h6 className={menu.menuTitles}>back</h6>
          </div>
          <div>
            <button className={menu.quotesButton} onClick={handleClickQuotes}>Q</button>
            <h6 className={menu.menuTitles}>quotes</h6>
          </div>
          <div>
            <button onClick={handleClickLists}><BurgerMenu></BurgerMenu></button>
            <h6 className={menu.menuTitles}>lists</h6>
          </div>
          <div>
            <button onClick={handleClickHide}><ArrowDown></ArrowDown></button>
            <h6 className={menu.menuTitles}>hide</h6>
          </div>
          <div>
            <button className={menu.starButton} onClick={isStarred?unstarr:starr}>{!isStarred?<Star></Star>:<StarSelected></StarSelected>}</button>
            <h6 className={menu.menuTitles}>starr</h6>
          </div>
          <div>
            <button className={menu.nextButton} onClick={handleClickNext}><ArrowNext></ArrowNext></button>
            <h6 className={menu.menuTitles}>next</h6>
          </div>
        </div>
      </div>
    </div>
  )
}