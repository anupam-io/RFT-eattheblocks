const { time } = require("@openzeppelin/test-helpers");

const RFT = artifacts.require("RFT");
const NFT = artifacts.require("NFT");
const DAI = artifacts.require("DAI");

const DAI_AMOUNT = web3.utils.toWei("25000");
const SHARE_AMOUNT = web3.utils.toWei("25000");

contract("RFT", async (addresses) => {
  const [admin, buyer1, buyer2, _] = addresses;

  it("ICO should work.", async () => {
    const dai = await DAI.new("My flying Dai", "DAI");
    const nft = await NFT.new("My flyign NFT", "NNN");

    await Promise.all([
      nft.mint(admin, 1),
      dai.mint(buyer1, DAI_AMOUNT),
      dai.mint(buyer2, DAI_AMOUNT),
    ]);

    const rft = await RFT.new(
      "My jumping RFT",
      "RFT",
      nft.address,
      1,
      1,
      web3.utils.toWei("100000"),
      dai.address
    );

    await nft.approve(rft.address, 1);
    await rft.startIco();

    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer1 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer1 });
    await dai.approve(rft.address, DAI_AMOUNT, { from: buyer2 });
    await rft.buyShare(SHARE_AMOUNT, { from: buyer2 });

    await time.increase(7 * 86400 + 1);

    await rft.withdrawIcoProfits();

    const balanceShareBuyer1 = await rft.balanceOf(buyer1);
    const balanceShareBuyer2 = await rft.balanceOf(buyer2);

    assert(balanceShareBuyer1.toString() === SHARE_AMOUNT);
    assert(balanceShareBuyer2.toString() === SHARE_AMOUNT);

    const balanceAdminDai = await dai.balanceOf(admin);
    assert(balanceAdminDai.toString() === web3.utils.toWei("50000"));
  });
});
