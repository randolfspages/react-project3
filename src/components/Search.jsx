

const Search = ({searchValue, setSearchValue}) => {
  return (
    <div className="search">
        <div>
            <img src="search-button.svg" alt="" />
            <input type="text" 
                   placeholder="Search for a movie"
                   value={searchValue} 
                   onChange={(event) => {setSearchValue(event.target.value)}} />
                   
        </div>
    </div>
  )
}

export default Search