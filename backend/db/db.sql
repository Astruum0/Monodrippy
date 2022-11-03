CREATE TABLE Rue (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     price INT NOT NULL,
     proprietaire INT NOT NULL,
     amelioration INT NOT NULL,
     valeur INT NOT NULL,
     loyer INT NOT NULL,
     PRIMARY KEY (id)
);

ALTER TABLE Rue
ADD FOREIGN KEY (proprietaire) REFERENCES Joueur(id);


CREATE TABLE Plateau (
     rue INT NOT NULL,
     joueur INT NOT NULL,
     chance INT NOT NULL,
     parcGratuit INT NOT NULL,
     prison INT
);

ALTER TABLE Plateau
ADD FOREIGN KEY (rue) REFERENCES Rue(id);

ALTER TABLE Plateau
ADD FOREIGN KEY (joueur) REFERENCES Joueur(id);

ALTER TABLE Plateau
ADD FOREIGN KEY (chance) REFERENCES Chance(id);
	
ALTER TABLE Plateau
ADD FOREIGN KEY (prison) REFERENCES Prison(id);

CREATE TABLE Chance (
     id INT NOT NULL AUTO_INCREMENT,
     nomCarte CHAR NOT NULL,
     contenu CHAR NOT NULL,
     garder TINYINT NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE Joueur (
     id INT NOT NULL AUTO_INCREMENT,
     name CHAR NOT NULL,
     argent INT NOT NULL,
     propriete INT,
     isPrisonnier TINYINT,
     hasGOOJC TINYINT,
     PRIMARY KEY (id)
);

CREATE TABLE Prison (
     id INT NOT NULL AUTO_INCREMENT,
     nbTours INT NOT NULL,
     PRIMARY KEY (id)
);
