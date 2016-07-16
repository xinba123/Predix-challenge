/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Author:  Jie Zhang
 * Created: 13/07/2016
 */

create table substation (
    subsid integer not null, 
    subsname varchar(255) not null,
    subslong double not null,
    subslat double not null,
    constraint subspk primary key (subsid)
);

create table outage (
    outid integer not null,
    outtype varchar(255) not null,
    outcat varchar(255) not null,
    outcust integer not null,
    outinterdate date not null,
    outfirstres date not null,
    outfinalres date not null,
    subsid integer not null,
    constraint outpk primary key (outid),
    constraint outsubsfk foreign key (subsid) references substation (subsid)
);
    


