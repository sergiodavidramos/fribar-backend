exports.xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Published by JAX-WS RI at http://jax-ws.dev.java.net. RI's version is JAX-WS RI 2.2.6hudson-86  svn-revision#12773. -->
<!-- Generated by JAX-WS RI at http://jax-ws.dev.java.net. RI's version is JAX-WS RI 2.2.6hudson-86  svn-revision#12773. -->
<definitions xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wsp="http://www.w3.org/ns/ws-policy" xmlns:wsp1_2="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="http://servicios.comelec.ws.sintesis.com.bo/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.xmlsoap.org/wsdl/" targetNamespace="http://servicios.comelec.ws.sintesis.com.bo/" name="ComelecWS">
<types>
<xsd:schema>
<xsd:import namespace="http://servicios.comelec.ws.sintesis.com.bo/" schemaLocation="https://web.sintesis.com.bo:8080/WSApp-war/ComelecWS?xsd=1"/>
</xsd:schema>
</types>
<message name="registroItem">
<part name="parameters" element="tns:registroItem"/>
</message>
<message name="registroItemResponse">
<part name="parameters" element="tns:registroItemResponse"/>
</message>
<message name="registroPlan">
<part name="parameters" element="tns:registroPlan"/>
</message>
<message name="registroPlanResponse">
<part name="parameters" element="tns:registroPlanResponse"/>
</message>
<message name="registroTarjetaHabiente">
<part name="parameters" element="tns:registroTarjetaHabiente"/>
</message>
<message name="registroTarjetaHabienteResponse">
<part name="parameters" element="tns:registroTarjetaHabienteResponse"/>
</message>
<message name="registroMdd">
<part name="parameters" element="tns:registroMdd"/>
</message>
<message name="registroMddResponse">
<part name="parameters" element="tns:registroMddResponse"/>
</message>
<portType name="ComelecWS">
<operation name="registroItem">
<input wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroItemRequest" message="tns:registroItem"/>
<output wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroItemResponse" message="tns:registroItemResponse"/>
</operation>
<operation name="registroPlan">
<input wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroPlanRequest" message="tns:registroPlan"/>
<output wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroPlanResponse" message="tns:registroPlanResponse"/>
</operation>
<operation name="registroTarjetaHabiente">
<input wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroTarjetaHabienteRequest" message="tns:registroTarjetaHabiente"/>
<output wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroTarjetaHabienteResponse" message="tns:registroTarjetaHabienteResponse"/>
</operation>
<operation name="registroMdd">
<input wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroMddRequest" message="tns:registroMdd"/>
<output wsam:Action="http://servicios.comelec.ws.sintesis.com.bo/ComelecWS/registroMddResponse" message="tns:registroMddResponse"/>
</operation>
</portType>
<binding name="ComelecWSPortBinding" type="tns:ComelecWS">
<soap:binding transport="http://schemas.xmlsoap.org/soap/http" style="document"/>
<operation name="registroItem">
<soap:operation soapAction=""/>
<input>
<soap:body use="literal"/>
</input>
<output>
<soap:body use="literal"/>
</output>
</operation>
<operation name="registroPlan">
<soap:operation soapAction=""/>
<input>
<soap:body use="literal"/>
</input>
<output>
<soap:body use="literal"/>
</output>
</operation>
<operation name="registroTarjetaHabiente">
<soap:operation soapAction=""/>
<input>
<soap:body use="literal"/>
</input>
<output>
<soap:body use="literal"/>
</output>
</operation>
<operation name="registroMdd">
<soap:operation soapAction=""/>
<input>
<soap:body use="literal"/>
</input>
<output>
<soap:body use="literal"/>
</output>
</operation>
</binding>
<service name="ComelecWS">
<port name="ComelecWSPort" binding="tns:ComelecWSPortBinding">
<soap:address location="https://web.sintesis.com.bo:8080/WSApp-war/ComelecWS"/>
</port>
</service>
</definitions>`;
