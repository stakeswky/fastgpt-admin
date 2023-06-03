import {
  createTextField,
  jsonServerProvider,
  ListTable,
  Resource,
  Tushan,
} from 'tushan';
import { authProvider } from './auth';
import { userFields } from './fields';



const dataProvider = jsonServerProvider('http://localhost:3001');

function App() {
  return (
    <Tushan
      basename="/"
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource
        name="users"
        label="User"
        list={
          <ListTable
            filter={[
              createTextField('q', {
                label: 'Query',
              }),
            ]}
            fields={userFields}
            action={{ create: true, detail: true, edit: true, delete: true }}
          />
        }
      />
    </Tushan>
  );
}

export default App;
