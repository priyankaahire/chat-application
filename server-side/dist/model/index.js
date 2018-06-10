"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    return User;
}());
exports.User = User;
var Message = /** @class */ (function () {
    function Message(from, content) {
        this.from = from;
        this.content = content;
    }
    return Message;
}());
exports.Message = Message;
var ChatMessage = /** @class */ (function (_super) {
    __extends(ChatMessage, _super);
    function ChatMessage(from, content) {
        return _super.call(this, from, content) || this;
    }
    return ChatMessage;
}(Message));
exports.ChatMessage = ChatMessage;
