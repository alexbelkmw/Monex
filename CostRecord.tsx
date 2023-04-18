import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Text, Modal } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

export interface Record {
    cost: string;
    category: string;
    comment: string;
}

export interface CostRecordProps {
    costRecord: Record;
    recordID: number;
    singleMod: boolean
    setCost: (value: string, index: number) => void
    setCategory: (value: string, index: number) => void
    setComment: (value: string, index: number) => void
}

export const categories = [
    'Алкоголь',
    'Барбер',
    'Бытовая химия',
    'Гигиена и косметика',
    'Другое',
    'Другое (входящий)',
    'Зарплата',
    'Интернет-магазины',
    'Кафе и развлечения',
    'Квартира',
    'Коммуналка',
    'Лекарства',
    'Маме',
    'Медицина',
    'Музыка',
    'Наличные',
    'Наличные (входящий)',
    'Настолки',
    'Одежда',
    'От родственников',
    'Перевод',
    'Перевод (входящий)',
    'Перевод Тинькоф',
    'Перекус',
    'Питание',
    'Питание дома (+химия)',
    'Питание дома',
    'Подарки/Поздравления',
    'Подписки',
    'Поездки',
    'Продажа',
    'Связь',
    'Себе',
    'Сигареты',
    'Спорт',
    'Такси',
    'Техника',
    'Транспорт',
]
export const CostRecord = (props: CostRecordProps) => {
    const { costRecord, recordID, singleMod, setCost, setCategory, setComment} = props
    const { cost, category, comment } = costRecord
    const [costValue, setCostValue] = useState(cost)
    const [commentValue, setCommentValue] = useState(comment)
    const [commentVisible, setCommentVisible] = useState(false)

    const startInputCost = () => {
        if (recordID === 0) return

        if (Number(cost) < 1) return

        setCost("-" + costValue, recordID); setCostValue("")
    }

    return (
        <>
            <Modal
                animationType="slide"
                visible={commentVisible}
                transparent={true}
                onRequestClose={() => {
                    setComment(commentValue, recordID)
                    setCommentVisible(false)
                }}
            >
                <View style={styles.centeredView} >
                    <View style={styles.modalView}>
                        <Text style={styles.textBtn}>Комментарий</Text>
                        <TextInput
                            multiline={true}
                            style={styles.modalInput}
                            onChangeText={(value) => { setCommentValue(value) }}
                            value={commentValue}
                        />
                        <View style={styles.footer} >
                            <Pressable
                                style={styles.bntModal}
                                onPress={() => { setCommentValue('') }}
                            >
                                <Text style={styles.bntModalText}>Очистить</Text>
                            </Pressable>
                            <Pressable
                                style={styles.bntModal}
                                onPress={() => { setComment(commentValue, recordID) }}
                            >
                                <Text style={styles.bntModalText}>Подтвердить</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.record}>
                <TextInput
                    style={styles.input}
                    onSubmitEditing={() => { setCost(costValue, recordID) }}
                    onPressIn={startInputCost}
                    onChangeText={(value) => { setCostValue(value) }}
                    value={costValue}
                    placeholder={(recordID === 0 && singleMod) ? 'Всего' : 'Отдельно'}
                    keyboardType="numeric" />
                <SelectDropdown
                    buttonStyle={styles.select}
                    data={categories}
                    defaultValue={category}
                    onSelect={(value: string) => { setCategory(value, recordID) }}
                />
                <Pressable
                    style={styles.oprButtom}
                    onPress={() => { setCommentVisible(true) }}
                >
                    <Text style={styles.textBtn}>#</Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        height: 250,
        marginVertical: 20,
        backgroundColor: '#32a883',
        borderRadius: 20,
        padding: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalInput: {
        backgroundColor: 'white',
        height: 80,
        width: 300,
        borderWidth: 1,
        padding: 10,
        color: 'black'
    },
    footer: {
        display: 'flex',
        width: '100%',
        paddingHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    bntModal: {
        width: 110,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    bntModalText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    record: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    select: {
        width: 210,
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
    },
    textBtn: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        borderRadius: 5,
        backgroundColor: 'white',
        height: 40,
        width: 90,
        borderWidth: 1,
        padding: 10,
        textAlign: "center",
        color: 'black'
    },
    oprButtom: {
        borderRadius: 5,
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    saveButton: {
        width: 140,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
});