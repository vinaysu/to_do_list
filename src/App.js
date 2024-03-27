import { useState, useEffect } from 'react';
import './App.css';
import { TextField, Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function App() {

  const [inputDetails, setInputDetails] = useState({ title: '', description: '', disabled: false })
  const [list, setList] = useState(() => {
    const storedList = JSON.parse(localStorage.getItem('taskList'));
    return storedList || [];
  });

  
  const [count, setCount] = useState(0)
  const [password,setPassword]=useState('')

  function handleChange(event) {
    const { name, value } = event.target;
    setInputDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('taskList'));
    sessionStorage.setItem('loginStatus', JSON.stringify(false));
    if (storedList) {
      setList(storedList);
      setCount(storedList.filter(task => !task.marked).length);
    }
  }, []);

  // Function to save the list to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(list));
  }, [list]);


  function handleAdd() {

    let status = JSON.parse(sessionStorage.getItem('loginStatus'));
    if (status == false) {
      window.alert(' Please login')
      setInputDetails({ title: '', description: '' })
      return
    }

    if (inputDetails.title == '') {
      alert('Enter the Title')
      return
    }

    setList((prev) => ([...prev, inputDetails]))
    setInputDetails({ title: '', description: '' })
    setCount(count + 1)
  }

  function handleStrike(index) {

    let status = JSON.parse(sessionStorage.getItem('loginStatus'));
    if (status == false) {
      window.alert(' Please login ')
      return
    }
    // Find the task in the list array
    const updatedList = list.map((task, i) => {
      if (i === index) {
        // If the index matches, update the marked status to true
        setCount(count == 0 ? 0 : count - 1)
        return { ...task, marked: true, disabled: true };
      }
      return task;
    });

    // Update the list state with the modified task
    setList(updatedList);
  }

  function handleRemove(index) {

    let status = JSON.parse(sessionStorage.getItem('loginStatus'));
    if (status == false) {
      window.alert('Please login ')
      return
    }

    const itemToRemove = list[index];
    if (!itemToRemove.marked) {
      setCount(prevCount => prevCount - 1);
    }

    const updatedList = list.filter((ele, i) => i !== index)

    setList(updatedList);

  }

  function handleLogin(){
    if(password!=="1234"){
      window.alert('Enter the correct Password')
      return
    }
    sessionStorage.setItem('loginStatus', JSON.stringify(true));
    window.alert('LoggedIn Successfully')
    setPassword('')
  }

  function handleLoginChange(event){
      setPassword(event.target.value)
  }

  return (
    <div className="App">
      <button onClick={handleLogin} >login Here</button><input value={password} onChange={handleLoginChange}  placeholder='Enter the password here' />
      <div className='top' >

        <h1>Enter the Task below</h1>
        <TextField value={inputDetails.title} onChange={handleChange} className='item' name='title' variant='standard' label='Enter the Title' />
        <textarea value={inputDetails.description} onChange={handleChange} placeholder='Enter the Description (Optional)' name='description' className='item' ></textarea>
        <Button onClick={handleAdd} className='item' variant='outlined' >Add to List</Button>
      </div>
      <h3>No of Pending Tasks {count}</h3>
      <hr />
      <div className='bottom' >
        <div className='cards' >
          {
            list.map((ele, index) =>
              <div className='card' >

                <div className='section' >
                  <h2 className='one' style={{ textDecoration: ele.marked ? 'line-through' : 'none', color: ele.marked ? 'black' : 'red', }}>{ele.title}</h2>
                  {ele.disabled ? '' : <CheckBoxIcon className='one' onClick={() => handleStrike(index)} sx={{ cursor: 'pointer' }} />}
                </div>
                <blockquote className='one' >{ele.description}</blockquote>
                <Button className='one' onClick={() => handleRemove(index)} variant='outlined'  >Remove</Button>


              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default App;
