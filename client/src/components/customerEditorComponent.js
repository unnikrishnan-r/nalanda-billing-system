import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle
} from 'react';
import "./style.css"

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
const CustomEditorComponent = forwardRef((props, ref) => {
  const [date, setDate] = useState(moment.utc(props.value).toDate());
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    if (!editing) {
      props.api.stopEditing();
    }
  });
  
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return moment(date).format('MM/DD/YYYY');
      },
    };
  });

  const onChange = selectedDate => {
    setDate(selectedDate);
    setEditing(false);
  };

  return (
    <div>
      <DatePicker
        id='customeDateEditor'
        selected={date}
        dateFormat="dd/MM/yyyy"
        onChange={onChange}
      />
    </div>
  );
});

export default CustomEditorComponent;
