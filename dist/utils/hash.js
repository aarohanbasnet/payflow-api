import bcrypt from "bcrypt";
export const hash = async function (input) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(input, salt);
};
export const compare = async function (plain, hash) {
    return await bcrypt.compare(plain, hash);
};
//# sourceMappingURL=hash.js.map