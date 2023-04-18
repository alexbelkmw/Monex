import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Pressable,
  Text,
  Switch
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CostRecord, Record, categories} from './CostRecord';
import * as RNFS from 'react-native-fs';

function App(): JSX.Element {
  const [date, setDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [singleMode, setSingleMode] = useState(true);
  const [records, setRecords] = useState<Record[]>([
    {cost: '', category: categories[0], comment: ''},
  ]);

  const inputCost = useCallback(
    (value: string, indexCost: number) => {
      const newRecords = records.map((record, i) => {
        if (i === indexCost) {
          const newCost = Number(value);
          const cost: number = indexCost !== 0 ? Number(record.cost) : 0;
          return {...record, cost: (cost + newCost).toString()};
        }

        return record;
      });

      /* Если ввёл сумму не в первую запись и сингл мод включён,
        то уменьшит общую сумму на введеное число*/
      if (indexCost !== 0 && singleMode) {
        setRecords([
          {
            ...newRecords[0],
            cost: (Number(newRecords[0].cost) - Number(value))
              .toFixed(2)
              .toString(),
          },
          ...newRecords.slice(1),
        ]);
      } else {
        setRecords(newRecords);
      }
    },
    [records],
  );

  const selectCategory = useCallback(
    (value: string, indexCost: number) => {
      const newRecords = records.map((record, i) => {
        if (i === indexCost) return {...record, category: value};

        return record;
      });
      setRecords(newRecords);
    },
    [records],
  );

  const inputComment = useCallback(
    (value: string, indexCost: number) => {
      const newRecords = records.map((record, i) => {
        if (i === indexCost) return {...record, comment: value};

        return record;
      });
      setRecords(newRecords);
    },
    [records],
  );

  const saveRecords = async (records: Record[], date:Date ) => {
    const filePath = RNFS.ExternalDirectoryPath + "/recors.txt";
    
    const day = date.toISOString().split('T')[0]
    
    const fileContent = records.map(
      record => `${day},${record.category},${record.cost},${record.comment}\n`).join('')

    await RNFS.appendFile(filePath, fileContent, "utf8");
    
    // обнуление состояния
    setRecords([{cost: '', category: categories[0], comment: ''}])
  } 

  const deleteRecord = () => {
    const lastCost = Number(records[records.length - 1].cost);
    const mainCost = Number(records[0].cost);
    if (singleMode){
      setRecords([
        {...records[0], cost: (mainCost + lastCost).toString()},
        ...records.slice(1, records.length - 1),
      ]);
    } else {
      setRecords([
        ...records.slice(0, records.length - 1),
      ]);
    }
  };

  return (
    <SafeAreaView>
      <View style={{...styles.wrapper}}>
        <View style={{...styles.settings}}>
          <Button
            title="Указать дату"
            onPress={() => {
              setModal(true);
            }}
            />
            <Text style={styles.text}>
              Одна покупка
            </Text>
            <Switch value={singleMode} onChange={()=>{setSingleMode(!singleMode)}}/>
          </View>
          <DatePicker
            mode="date"
            locale="ru"
            date={date}
            onConfirm={date => {
              setModal(false);
              setDate(date);
            }}
            onCancel={() => {
              setModal(false);
            }}
            modal
            open={modal}
          />
        {records.map((record, i) => {
          const viewKey = Math.random().toString();
          return (
            <CostRecord
              key={viewKey}
              costRecord={record}
              recordID={i}
              setCost={inputCost}
              setCategory={selectCategory}
              setComment={inputComment}
              singleMod={singleMode}
            />
          );
        })}
        <View style={{...styles.controlBtns}}>
          <Pressable
            style={styles.oprButtom}
            onPress={deleteRecord}
            disabled={records.length <= 1}>
            <Text style={styles.text}>-</Text>
          </Pressable>
          <Pressable
            style={styles.saveButton}
            onPress={() => { saveRecords(records, date) }}
          >
            <Text style={styles.text}>Сохранить</Text>
          </Pressable>
          <Pressable
            style={styles.oprButtom}
            onPress={() => {
              setRecords([
                ...records,
                {cost: '', category: records[records.length-1].category, comment: ''},
              ]);
            }}
            disabled={records.length >= 10}>
            <Text style={styles.text}>+</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#008EFF',
    width: '100%',
    height: '100%',
    paddingTop: 25,
    alignItems: 'center',
  },
  settings: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 13,
  },
  controlBtns: {
    marginTop: 20,
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  oprButtom: {
    borderRadius: 10,
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  saveButton: {
    borderRadius: 10,
    width: 140,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
