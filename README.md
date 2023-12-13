Concept de MeltingPotes : Une dapp où des utilisateurs peuvent créer une instance, y déposer des fonds en commun, définir des règles de bases (date d'expiration, addresses authorisées à recevoir...) 
dépenser ces fonds en gardant un historique et un contrôle continue, puis recevoir ce qui reste une fois que l'instance devient inactive.

La dapp se divise en 3 partie: L'écran d'accueil, l'interface et l'instance sélectionnée.


Note: Afin de passer les tests, les functions fonctions sendBackFunds, calculatePercentage et calculateAmountToSend ont été passées en public. 
Dans le cadre d'un véritable déploiement elles auraient été mises en internal/private. 

Last update : implementation de la messagerie instantannée avec XMTP. 

Petits bugs qui n'ont pas eu le temps d'être corrigé :

- L'affichage de l'argent déposé par chaque participant. (lié à un problème de client side sur next.js)
- Le rafraichissement automatique de la page une fois une action effectuée (plutôt que de le faire manuellement)
- Un coverage à 100% des tests
- Un smart contract plus concis

Front deployé avec Vercel (avec le smart contract de Mumbai) : https://melting-potes-vercel.vercel.app/

Lien loom démonstration de la dapp : [https://www.loom.com/share/8f118bc565ce4a309744b99143dd967f](https://www.loom.com/share/eac717dd595747eea4a0699336629ea6?sid=9f8d0700-44cf-4a9b-a011-cb06fdda0984)

Déployé sur Mumbai : 0x0529E84a91761f8fA9b3d7e568c9dF5e0Cc3DC50

Déployé sur Sepolia :
```shell
    yarn hardhat run ./scripts/deploy.js --network sepolia
```

```shell
  yarn hardhat verify 0xE1eE9D9dFa4F339ec62fFb2E76Bc203c26A58267 --network sepolia
```
    
Successfully submitted source code for contract contracts/MeltingPotesFactory.sol:MeltingPotesFactory at 0xE1eE9D9dFa4F339ec62fFb2E76Bc203c26A58267 for verification on the block explorer. 
Waiting for verification result...
Successfully verified contract MeltingPotesFactory on the block explorer. https://sepolia.etherscan.io/address/0xE1eE9D9dFa4F339ec62fFb2E76Bc203c26A58267#code

TESTS : 73 passing (3s)

--------------------------|----------|----------|----------|----------|----------------|
File                      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------|----------|----------|----------|----------|----------------|
 contracts/               |    90.36 |    86.25 |    96.15 |    92.23 |                |
  MeltingPotesFactory.sol |    90.36 |    86.25 |    96.15 |    92.23 |... 123,124,126 |
--------------------------|----------|----------|----------|----------|----------------|
All files                 |    90.36 |    86.25 |    96.15 |    92.23 |                |
--------------------------|----------|----------|----------|----------|----------------|
