import { Route, Routes } from 'react-router-dom'
import { menus } from '../Menu'

const Routers = () => {
  console.log(menus, 'menus');
  return (
    <div>
      <Routes>
        {
          menus.map(v => (
            <Route key={v.path} path={v.path} element={v.component()} />
          ))
        }
      </Routes>
    </div>
  )
};

export default Routers;