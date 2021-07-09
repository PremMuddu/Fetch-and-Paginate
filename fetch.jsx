
const Pagination = ({ items, pageSize, onPageChange }) => {
  
  if (items.length <= 1){
  return null;
  }
 
 const numPages = Math.ceil(items.length / pageSize);


 const pages = range(1, numPages);

 const list = pages.map((number) => (
   <ReactBootstrap.Button 
   key={number}
   onClick={onPageChange}
   className="page-item"
   >
   {number}
   
   </ReactBootstrap.Button>
 ));
 
 return (
   <nav>
   <ul>
    {list}
   </ul>
   </nav>
 )
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    
    let didCancel = false;
    
    const fetchData = () => {
     
      dispatch({ type: 'FETCH_INIT' });
      axios.get(url)
      .then((result) => { 
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      })
     .catch(()=> {
      dispatch({ type: 'FETCH_FAILURE' });
        });
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};


function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState('coronavirus');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'https://hn.algolia.com/api/v1/search?query=corona-virus',
    {
      hits: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    <Fragment>
      {isLoading ? (
        <div>Wait...</div>
      ) : (
    
        <ul className="list-group">
          {page.map((item) => (
            <li className="list-group-item" key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
