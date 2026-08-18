import { generateAccountNumber } from "./src/utils/accountNumber";
import { generateUsername} from "./src/utils/username";
import { generateReferenceNumber } from "./src/utils/referenceNumber";
import { maskPhone  } from "./src/utils/mask"

// const username = await generateUsername("aarohan12@gmail.com");
// console.log(username);

const accountNumber = generateAccountNumber();
console.log(accountNumber);

const referenceNumber = generateReferenceNumber();
console.log(referenceNumber);

const maskedPhone = maskPhone("9812345678");
console.log(maskedPhone)