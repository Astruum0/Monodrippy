CREATE TABLE Modules (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     price INT NOT NULL,
     owner INT NOT NULL,
     upgrade INT NOT NULL,
     value INT NOT NULL,
     rent INT NOT NULL,
     PRIMARY KEY (id)
);


CREATE TABLE Board (
     modules INT NOT NULL,
     player INT NOT NULL,
     chance INT NOT NULL,
     freePark INT NOT NULL,
     prison INT
);

CREATE TABLE Chance (
     id INT NOT NULL AUTO_INCREMENT,
     name CHAR NOT NULL,
     content CHAR NOT NULL,
     keep TINYINT NOT NULL,
     PRIMARY KEY (id)
);

CREATE TABLE Player (
     id INT NOT NULL AUTO_INCREMENT,
     name CHAR NOT NULL,
     money INT NOT NULL,
     estate INT,
     isJailed TINYINT,
     hasGOOJC TINYINT,
     PRIMARY KEY (id)
);

CREATE TABLE Prison (
     id INT NOT NULL AUTO_INCREMENT,
     numberOfTurn INT NOT NULL,
     PRIMARY KEY (id)
);

ALTER TABLE Modules
ADD FOREIGN KEY (owner) REFERENCES Player(id);

ALTER TABLE Board
ADD FOREIGN KEY (modules) REFERENCES Modules(id);

ALTER TABLE Board
ADD FOREIGN KEY (player) REFERENCES Player(id);

ALTER TABLE Board
ADD FOREIGN KEY (chance) REFERENCES Chance(id);
	
ALTER TABLE Board
ADD FOREIGN KEY (prison) REFERENCES Prison(id);