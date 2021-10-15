import { useEffect, useState } from "react"
import db from "../Firebase"

const useData = (collection, condition) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        let collectionRef = db.collection(collection).orderBy("timestamp");

        //Condition
        /** 
         * fieldName: ,
         * operation: ><= / in ==> string or array
         * compareValue: ''
         * **/

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                return;
            }
            collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue)
        }

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            setData([...snapshot.docs.map((item) => ({ id: item.id, data: item.data() }))])

        })

        return () => {
            unsubscribe();
        }
    }, [condition, collection])
    return data;
}
export default useData;