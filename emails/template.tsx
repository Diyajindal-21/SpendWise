import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
type EmailTemplateProps = {
    username?: string;
    type?: "budget-alert" | "monthly-report";
    data: {
      month: React.ReactNode;
      stats: any;
      insights:any;
      percentageUsed: number;
      budgetAmount: number;
      totalExpenses: number;
      accountName?: string;
    };
  };
  
export default function EmailTemplate({
    username = "",
  type = "budget-alert",
  data
}: EmailTemplateProps) {
    if(type==="monthly-report"){
      return (
        <Html>
          <Head />
          <Preview>Your Monthly Financial Report</Preview>
          <Body style={styles.body}>
            <Container style={styles.container}>
              <Heading style={styles.title}>Monthly Financial Report</Heading>
  
              <Text style={styles.text}>Hello {username},</Text>
              <Text style={styles.text}>
                Here&rsquo;s your financial summary for {data?.month}:
              </Text>
  
              {/* Main Stats */}
              <Section style={styles.statsContainer}>
                <div style={styles.stat}>
                  <Text style={styles.text}>Total Income</Text>
                  <Text style={styles.heading}>${data?.stats.totalIncome}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Total Expenses</Text>
                  <Text style={styles.heading}>${data?.stats.totalExpenses}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Net</Text>
                  <Text style={styles.heading}>
                    ${data?.stats.totalIncome - data?.stats.totalExpenses}
                  </Text>
                </div>
              </Section>
  
              {/* Category Breakdown */}
              {data?.stats?.byCategory && (
                <Section style={styles.section}>
                  <Heading style={styles.heading}>Expenses by Category</Heading>
                  {Object.entries(data?.stats.byCategory).map(
                    ([category, amount]) => (
                      <div key={category} style={styles.row}>
                        <Text style={styles.text}>{category}</Text>
                        <Text style={styles.text}>${String(amount)}</Text>
                      </div>
                    )
                  )}
                </Section>
              )}
  
              {/* AI Insights */}
              {data?.insights && (
                <Section style={styles.section}>
                  <Heading style={styles.heading}>SpendWise Insights</Heading>
                  {React.Children.map(data.insights, (insight, index) => (
                    <Text key={index} style={styles.text}>
                      • {insight}
                    </Text>
                  ))}
                </Section>
              )}
  
              <Text style={{...styles.footer, textAlign: "center" as const}}>
                Thank you for using SpendWise. Keep tracking your finances for better
                financial health!
              </Text>
            </Container>
          </Body>
        </Html>
      );
    }
    if(type==="budget-alert"){
        return (
            <Html>
              <Head></Head>
              <Preview>Budget Alert</Preview>
              <Body style={styles.body}>
                <Container style={styles.container}>
                    <Heading style={styles.title}>
                        Budget Alert
                        </Heading>
                    <Text style={styles.title}>
                        Hello {username},
                        </Text>
                        <Text style={styles.text}>
                            You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your monthly budget.
                        </Text>
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Budget Amount</Text>
                                <text style={styles.heading}>${data?.budgetAmount}</text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Spent So Far</Text>
                                <text style={styles.heading}>${data?.totalExpenses}</text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Remaining</Text>
                                <text style={styles.heading}>${data?.budgetAmount - data?.totalExpenses}</text>
                            </div>
                        </Section>
                </Container>
              </Body>
            </Html>
          );
    }
  
}
const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif"
  },
  container:{
    backgroundColor: "#ffffff",
    margin:"0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  },
  title:{
    color:"#1f2937",
    fontSize:"32px",
    fontWeight:"bold",
    fontAlign:"center",
    margin:"0 0 20px"
  },
  heading:{
    color:"#1f2937",
    fontSize:"20px",
    fontWeight:"600",
    margin:"0 0 16px"
  },
  text:{
    color:"#4b5563",
    fontSize:"16px",
    margin:"0 0 16px",
  },
  statsContainer:{
    margin:"32px 0",
    padding:"20px",
    borderRadius:"5px",
    backgroundColor:"#f9fafb"
  },
  stat:{
    marginBottom:"16px",
    padding:"12px",
    borderRadius:"4px",
    backgroundColor:"#fff",
    boxShadow:"0 1px 2px rgba(0, 0, 0, 0.05)"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  }
};
