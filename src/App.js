import React, {useState, useEffect} from "react"
import "./App.scss"
const api = "https://api.unsplash.com/search/photos?page=1&per_page=25&query=dog&orientation=landscape"
const Authorization = "Client-ID 0bd7304d669c2a900ff77e181962efac03911ab095bbb9ed817a92323ea30d63"

function App() {
  const [imgs, setImgs] = useState([])
  const [visibleImgs, setVisibleImgs] = useState([])
  const [selected, setSelected] = useState()
  const [activeCard, setActiveCard] = useState()

  useEffect(() => {
    getPhotos()
  }, [])

  const getPhotos = async () => {
    const response = await fetch(api, {
      headers: {"Content-Type": "application/json", Authorization},
    })
    const {results} = await response.json()
    if (!results || results.errors) return

    setSelected(results[13]?.id)
    setImgs(results)
    setVisibleImgs(results.slice(11, 16))
  }

  const onChange = (id, index) => {
    setSelected(id)
    const ii = imgs.findIndex((item) => item.id === id)
    if (imgs[0].id === visibleImgs[0].id && [0, 1, 2].includes(ii)) return
    const last = imgs.length
    if (imgs[last - 1].id === visibleImgs[visibleImgs.length - 1].id && [last, last - 1, last - 2].includes(ii)) return

    if (ii === 1) {
      setVisibleImgs(imgs.slice(0, 6))
      setActiveCard(1)
      setTimeout(() => {
        setActiveCard(0)
        setVisibleImgs(imgs.slice(0, 5))
      }, 500)
      return
    }

    if (ii === imgs.length - 1) {
      setVisibleImgs(imgs.slice(imgs.length - 6, imgs.length))
      setActiveCard(1)
      setTimeout(() => {
        setActiveCard(0)
        setVisibleImgs(imgs.slice(imgs.length - 5, imgs.length))
      }, 500)
      return
    }

    const raznitsa = 2 - index

    if (raznitsa > 0) {
      setVisibleImgs(imgs.slice(ii - 2, ii - 2 + 5 + raznitsa))
    } else {
      setVisibleImgs(imgs.slice(ii - 2 + raznitsa, ii - 2 + 5))
    }

    setActiveCard(raznitsa)

    setTimeout(() => {
      setActiveCard(0)
      setVisibleImgs(imgs.slice(ii - 2, ii - 2 + 5))
    }, 500)
  }

  return (
    <div className="good-boys">
      <div className="container">
        {visibleImgs.map((img, index) => (
          <div
            key={img.id}
            className={`slide ${selected === img.id ? "active" : ""} 
            ${activeCard === 1 && index === 5 ? "remove" : ""} 
            ${activeCard === 2 && (index === 6 || index === 5) ? "remove" : ""}
            ${activeCard === -1 && index === 0 ? "remove" : ""} 
            ${activeCard === -2 && (index === 0 || index === 1) ? "remove" : ""}
            ${activeCard === 1 && index === 0 ? "add" : ""}
            ${activeCard === 2 && (index === 0 || index === 1) ? "add" : ""}
            ${activeCard === -1 && index === 5 ? "add" : ""} 
            ${activeCard === -2 && (index === 5 || index === 6) ? "add" : ""}
            `}
            onClick={() => onChange(img.id, index)}
            style={{backgroundImage: `url(${img.urls.regular})`}}
          >
            <h3>{img.description || img.alt_description}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
