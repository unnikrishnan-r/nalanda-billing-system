import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import API from "../../utils/API";
import "./style.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  responseType: "text",
  friendlyMessage: "Hi! I'm your Nalanda Assistant. How can I help you today?",
  data: null,
  suggestions: [
    "Latex collection for last 30 days",
    "What is the total due amount?",
    "List all customers",
    "Download latex report",
  ],
};

class ChatWidget extends Component {
  state = {
    isOpen: false,
    messages: [WELCOME_MESSAGE],
    inputValue: "",
    isLoading: false,
  };

  messagesEndRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.messages.length !== this.state.messages.length ||
      prevState.isLoading !== this.state.isLoading
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  toggleChat = () => {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  sendMessage = (text) => {
    const message = text || this.state.inputValue.trim();
    if (!message || this.state.isLoading) return;

    const userMessage = { role: "user", content: message };

    this.setState(
      (prev) => ({
        messages: [...prev.messages, userMessage],
        inputValue: "",
        isLoading: true,
      }),
      () => {
        API.sendAssistantMessage({ message })
          .then((res) => {
            const data = res.data;
            const assistantMessage = {
              role: "assistant",
              friendlyMessage: data.friendlyMessage,
              responseType: data.responseType,
              columns: data.columns,
              data: data.data,
              summary: data.summary,
              downloadData: data.downloadData,
            };
            this.setState((prev) => ({
              messages: [...prev.messages, assistantMessage],
              isLoading: false,
            }));
          })
          .catch(() => {
            const errorMessage = {
              role: "assistant",
              friendlyMessage:
                "Sorry, I couldn't process your request. Please try again.",
              responseType: "text",
              data: null,
            };
            this.setState((prev) => ({
              messages: [...prev.messages, errorMessage],
              isLoading: false,
            }));
          });
      }
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendMessage();
  };

  handleSuggestionClick = (suggestion) => {
    this.sendMessage(suggestion);
  };

  handleDownload = (downloadData) => {
    const blob = new Blob([downloadData.content], {
      type: downloadData.mimeType,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  renderTable = (columns, data) => {
    if (!data || data.length === 0) return null;
    const displayData = data.slice(0, 20);

    return (
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 20 && (
          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
            Showing 20 of {data.length} rows
          </div>
        )}
      </div>
    );
  };

  renderSummary = (summary) => {
    if (!summary) return null;
    return (
      <div className="summary-box">
        {summary.totalNetWeight && (
          <span>
            Total Net Weight: <strong>{summary.totalNetWeight} kg</strong>
          </span>
        )}
        {summary.totalAmount && (
          <span>
            Total Amount: <strong>Rs. {summary.totalAmount}</strong>
          </span>
        )}
        {summary.totalDue && (
          <span>
            Total Due: <strong>Rs. {summary.totalDue}</strong>
          </span>
        )}
        {summary.recordCount !== undefined && (
          <span>
            Records: <strong>{summary.recordCount}</strong>
            {summary.showing && summary.showing < summary.recordCount
              ? ` (showing ${summary.showing})`
              : ""}
          </span>
        )}
        {summary.customerCount !== undefined && (
          <span>
            Customers: <strong>{summary.customerCount}</strong>
          </span>
        )}
      </div>
    );
  };

  renderMessage = (msg, index) => {
    if (msg.role === "user") {
      return (
        <div key={index} className="chat-message user">
          <div className="chat-bubble user">{msg.content}</div>
        </div>
      );
    }

    return (
      <div key={index} className="chat-message assistant">
        <div className="chat-bubble assistant">
          {msg.friendlyMessage && <div>{msg.friendlyMessage}</div>}

          {msg.responseType === "table" &&
            msg.columns &&
            this.renderTable(msg.columns, msg.data)}

          {msg.responseType === "text" && msg.data && (
            <div
              className="help-text"
              dangerouslySetInnerHTML={{
                __html: msg.data.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          )}

          {msg.responseType === "download" && msg.downloadData && (
            <Button
              variant="outline-primary"
              size="sm"
              className="download-btn"
              onClick={() => this.handleDownload(msg.downloadData)}
            >
              Download {msg.downloadData.filename}
            </Button>
          )}

          {this.renderSummary(msg.summary)}

          {msg.suggestions && (
            <div className="chat-suggestions">
              {msg.suggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => this.handleSuggestionClick(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const userId = sessionStorage.getItem("UserId");
    if (!userId) return null;

    const { isOpen, messages, inputValue, isLoading } = this.state;

    return (
      <div className="chat-widget">
        {isOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <h6>Nalanda Assistant</h6>
              <button className="chat-header-close" onClick={this.toggleChat}>
                &#x2715;
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => this.renderMessage(msg, i))}
              {isLoading && (
                <div className="chat-loading">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={this.messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <Form onSubmit={this.handleSubmit} className="chat-input-form">
                <Form.Control
                  type="text"
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={this.handleInputChange}
                  disabled={isLoading}
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                >
                  Send
                </Button>
              </Form>
            </div>
          </div>
        )}

        <button className="chat-toggle-btn" onClick={this.toggleChat}>
          {isOpen ? "\u2715" : "\u{1F4AC}"}
        </button>
      </div>
    );
  }
}

export default ChatWidget;
