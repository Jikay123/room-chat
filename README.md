# Note sau project

0. library :
   date-fns/esm
1. custom hook
2. Material ui: <Avatar> , <Tooltip> , <Grid> , <Modal>

# ==> Antd

3. Firebase
4. Login width gmail, fb
5. Context API
6. Logic thuật toán find user

# Liệt kê các ký tự có thể nối liền kề với nhau ==> tìm kiếm

const generateKeywords = (displayName) => {

    const name = displayName.split(' ').filter((word) => word); ==> tách chuỗi thành mảng các từ kết hợp trong chuỗi

    VD: "tach chuoi" => ["tach", "chuoi"]

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/

    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;

};
