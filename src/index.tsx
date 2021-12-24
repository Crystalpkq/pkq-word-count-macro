import ForgeUI, { 
  render, 
  Fragment, 
  Macro, 
  Text, 
  Strong,
  Form, 
  TextArea, 
  Radio,
  RadioGroup,
  SectionMessage, 
  useState, 
  Table, 
  Head, 
  Row, 
  Cell 
} from '@forge/ui';

const App = () => {
  // useState is a UI kit hook we use to manage the form data in local state
  const [formState, setFormState] = useState({
    inputStr: "",
    sortedInputStr: [],
  });
  
  // Handles form submission, which is a good place to call APIs, or to set component state...
  const onSubmit = async (formData) => {
    // split the words from the TextArea by blankspace into an array 
    const inputStrArr = formData.inputStr ? formData.inputStr.replace(/\n/g, ' ').split(' ').filter(x => x !== '') : [];
    // create a map of objects using reduce function to get the count of the words
    const inputStrMap = inputStrArr.reduce(function(prev, cur) {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
    // convert the maps to array of objects to perform sorting
    const unsortedArr = Object.keys(inputStrMap).map((key) => {
      return {
        word: key,
        count: inputStrMap[key]
      }
    });
    // sort the unsorted arrays of objects based on the user input sorting method
    const sortedInputStr = unsortedArr.sort((a, b) => {
      if (formData.sortRsl === "word") {
        if(a.word > b.word) {
          return formData.sortOrder === "asc" ? 1 : -1;
        } else if(a.word < b.word) {
          return formData.sortOrder === "asc" ? -1 : 1;
        } else {
          return 0;
        }
      } else {
        if(a.count > b.count) {
          return formData.sortOrder === "asc" ? 1 : -1;
        } else if(a.count < b.count) {
          return formData.sortOrder === "asc" ? -1 : 1;
        } else {
          return 0;
        }
      }      
    });
    setFormState({
      ...formState,
      inputStr: formData.inputStr,
      sortedInputStr: sortedInputStr,          
    });
  };

  return (
    <Fragment>
      <Form onSubmit={onSubmit} submitButtonText="Click to Count!">
        <TextArea isRequired={true} name="inputStr" label="Your input text: " />
        <RadioGroup name="sortRsl" label="Sort results by">
          <Radio defaultChecked label="Word" value="word" />
          <Radio label="Count" value="count" />
        </RadioGroup>
        <RadioGroup name="sortOrder" label="Sort order by">
          <Radio defaultChecked label="Ascending" value="asc" />
          <Radio label="Descending" value="dsc" />
        </RadioGroup>
      </Form>

      {formState && formState.inputStr ? 
        <SectionMessage appearance="confirmation">
        <Text>You've entered: </Text>
        <Text>{formState.inputStr}</Text>
      </SectionMessage> : 
      <SectionMessage appearance="info">
        <Text>Please input some text and click the button to count the words.</Text>
      </SectionMessage>
      }     

      <Table>
        <Head>
          <Cell>
            <Text>Word</Text>
          </Cell>
          <Cell>
            <Text>Count</Text>
          </Cell>
        </Head>
          {formState && formState.sortedInputStr.length ? formState.sortedInputStr.map(str => (
          <Row>
            <Cell>
              <Text>{str.word}</Text>
            </Cell>
            <Cell>
              <Text>{str.count}</Text>
            </Cell>
          </Row>
        )) : 
        <Row>
            <Cell>
              <Text><Strong>No Data</Strong></Text>
            </Cell>
          </Row>}
      </Table>
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
