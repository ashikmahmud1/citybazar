import {Member} from "../models/member";

export class MemberService {
  public members:Member[] = [
    {Id:1,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()},
    {Id:2,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()},
    {Id:3,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()},
    {Id:4,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()},
    {Id:5,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()},
    {Id:6,Name:'Ashik Mahmaud',MobileNo:'01932976181',Address:'something',ReferenceNumber:'0293020',Point:50,Date:new Date()}
  ];

  getMaxID() {
    return this.members.reduce(function(prev, current) {
      return (prev.Id > current.Id) ? prev : current
    });
  }
}
